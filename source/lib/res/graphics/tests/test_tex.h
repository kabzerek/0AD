/* Copyright (c) 2010 Wildfire Games
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

#include "lib/self_test.h"

#include "lib/tex/tex.h"
#include "lib/tex/tex_codec.h"
#include "lib/allocators/shared_ptr.h"

class TestTex : public CxxTest::TestSuite 
{
	void generate_encode_decode_compare(size_t w, size_t h, size_t flags, size_t bpp, const OsPath& extension)
	{
		// generate test data
		const size_t size = w*h*bpp/8;
		shared_ptr<u8> img(new u8[size], ArrayDeleter());
		std::generate(img.get(), img.get()+size, rand);

		// wrap in Tex
		Tex t;
		TS_ASSERT_OK(tex_wrap(w, h, bpp, flags, img, 0, &t));

		// encode to file format
		DynArray da;
		TS_ASSERT_OK(tex_encode(&t, extension, &da));
		memset(&t, 0, sizeof(t));

		// decode from file format
		shared_ptr<u8> ptr = DummySharedPtr(da.base);
		TS_ASSERT_OK(tex_decode(ptr, da.cur_size, &t));

		// make sure pixel format gets converted completely to plain
		TS_ASSERT_OK(tex_transform_to(&t, 0));

		// compare img
		TS_ASSERT_SAME_DATA(tex_get_data(&t), img.get(), size);

		// cleanup
		tex_free(&t);
		TS_ASSERT_OK(da_free(&da));
	}

public:

	// this also covers BGR and orientation transforms.
	void DISABLED_test_encode_decode()	// disabled because it's completely broken
	{
		tex_codec_register_all();

		// for each codec
		const TexCodecVTbl* c = 0;
		for(;;)
		{
			c = tex_codec_next(c);
			if(!c)
				break;

			// get an extension that this codec will support
			// (so that tex_encode uses this codec)
			wchar_t extension[30] = {'.'};
			wcscpy_s(extension+1, 29, c->name);
			// .. make sure the c->name hack worked
			const TexCodecVTbl* correct_c = 0;
			TS_ASSERT_OK(tex_codec_for_filename(extension, &correct_c));
			TS_ASSERT_EQUALS(c, correct_c);

			// for each test width/height combination
			const size_t widths [] = { 4, 5, 4, 256, 384 };
			const size_t heights[] = { 4, 4, 5, 256, 256 };
			for(size_t i = 0; i < ARRAY_SIZE(widths); i++)
			{
				// for each bit depth
				for(size_t bpp = 8; bpp <= 32; bpp += 8)
				{
					size_t flags = 0;
					if(!wcscmp(extension, L".dds"))
						flags |= (TEX_DXT&3);	// DXT3
					if(bpp == 8)
						flags |= TEX_GREY;
					else if(bpp == 16)
						continue; // not supported
					else if(bpp == 32)
						flags |= TEX_ALPHA;

					// normal
					generate_encode_decode_compare(widths[i], heights[i], flags, bpp, extension);
					// top-down
					flags &= ~TEX_ORIENTATION; flags |= TEX_TOP_DOWN;
					generate_encode_decode_compare(widths[i], heights[i], flags, bpp, extension);
					// bottom up
					flags &= ~TEX_ORIENTATION; flags |= TEX_BOTTOM_UP;
					generate_encode_decode_compare(widths[i], heights[i], flags, bpp, extension);

					flags &= ~TEX_ORIENTATION;
					flags |= TEX_BGR;

					// bgr, normal
					generate_encode_decode_compare(widths[i], heights[i], flags, bpp, extension);
					// bgr, top-down
					flags &= ~TEX_ORIENTATION; flags |= TEX_TOP_DOWN;
					generate_encode_decode_compare(widths[i], heights[i], flags, bpp, extension);
					// bgr, bottom up
					flags &= ~TEX_ORIENTATION; flags |= TEX_BOTTOM_UP;
					generate_encode_decode_compare(widths[i], heights[i], flags, bpp, extension);
				}	// for bpp
			}	// for width/height
		}	 // foreach codec

		tex_codec_unregister_all();
	}

	// have mipmaps be created for a test image; check resulting size and pixels
	void test_mipmap_create()
	{
		static u8 imgData[] = { 0x10,0x20,0x30, 0x40,0x60,0x80, 0xA0,0xA4,0xA8, 0xC0,0xC1,0xC2 };
		shared_ptr<u8> img = DummySharedPtr(imgData);
		// assumes 2x2 box filter algorithm with rounding
		static const u8 mipmap[] = { 0x6C,0x79,0x87 };
		Tex t;
		TS_ASSERT_OK(tex_wrap(2, 2, 24, 0, img, 0, &t));
		TS_ASSERT_OK(tex_transform_to(&t, TEX_MIPMAPS));
		const u8* const out_img = tex_get_data(&t);
		TS_ASSERT_EQUALS((int)tex_img_size(&t), 12+3);
		TS_ASSERT_SAME_DATA(out_img, imgData, 12);
		TS_ASSERT_SAME_DATA(out_img+12, mipmap, 3);
	}

	void test_img_size()
	{
		shared_ptr<u8> img(new u8[100*100*4], ArrayDeleter());

		Tex t;
		TS_ASSERT_OK(tex_wrap(100, 100, 32, TEX_ALPHA, img, 0, &t));
		TS_ASSERT_EQUALS((int)tex_img_size(&t), 40000);

		// DXT rounds up to 4x4 blocks; DXT1a is 4bpp
		Tex t2;
		TS_ASSERT_OK(tex_wrap(97, 97, 4, DXT1A, img, 0, &t2));
		TS_ASSERT_EQUALS((int)tex_img_size(&t2),  5000);
	}

	void test_s3tc_decode()
	{
		tex_codec_register_all();

		const size_t w = 4, h = 4, bpp = 4;
		const size_t size = w*h/2;
		shared_ptr<u8> img(new u8[size], ArrayDeleter());
		memcpy(img.get(), "\xFF\xFF\x00\x00\x00\xAA\xFF\x55", 8); // gradient from white to black
		const u8 expected[] =
			"\xFF\xFF\xFF" "\xFF\xFF\xFF" "\xFF\xFF\xFF" "\xFF\xFF\xFF"
			"\xAA\xAA\xAA" "\xAA\xAA\xAA" "\xAA\xAA\xAA" "\xAA\xAA\xAA"
			"\x55\x55\x55" "\x55\x55\x55" "\x55\x55\x55" "\x55\x55\x55"
			"\x00\x00\x00" "\x00\x00\x00" "\x00\x00\x00" "\x00\x00\x00";

		const size_t flags = TEX_DXT&1;

		// wrap in Tex
		Tex t;
		TS_ASSERT_OK(tex_wrap(w, h, bpp, flags, img, 0, &t));

		// decompress S3TC
		TS_ASSERT_OK(tex_transform_to(&t, 0));

		// compare img
		TS_ASSERT_SAME_DATA(tex_get_data(&t), expected, 48);

		// cleanup
		tex_free(&t);

		tex_codec_unregister_all();
	}
};
