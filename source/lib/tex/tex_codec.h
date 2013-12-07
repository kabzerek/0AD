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

/*
 * support routines and interface for texture codecs.
 */

#ifndef INCLUDED_TEX_CODEC
#define INCLUDED_TEX_CODEC

#include "tex.h"
#include "tex_internal.h"	// for codec's convenience

/**
 * virtual method table for TexCodecs.
 * rationale: this works in C and also allows storing name and next in vtbl.
 * 'template method'-style interface to increase code reuse and
 * simplify writing new codecs.
 **/
struct TexCodecVTbl
{
	/**
	 * decode the file into a Tex structure.
	 *
	 * @param data input data array (non-const, because the texture
	 * may have to be flipped in-place - see "texture orientation").
	 * @param size [bytes] of data, always >= 4
	 *   (this is usually enough to compare the header's "magic" field,
	 *    and no legitimate file will be smaller)
	 * @param t output texture object
	 * @return Status
	 **/
	Status (*decode)(u8* data, size_t size, Tex* RESTRICT t);

	/**
	 * encode the texture data into the codec's file format (in memory).
	 *
	 * @param t input texture object. note: non-const because encoding may
	 * require a tex_transform.
	 * @param da output data array, allocated by codec.
	 * rationale: some codecs cannot calculate the output size beforehand
	 * (e.g. PNG output via libpng), so the output memory cannot be allocated
	 * by the caller.
	 * @return Status
	 **/
	Status (*encode)(Tex* RESTRICT t, DynArray* RESTRICT da);

	/**
	 * transform the texture's pixel format.
	 *
	 * @param t texture object
	 * @param transforms: OR-ed combination of TEX_* flags that are to
	 * be changed. note: the codec needs only handle situations specific
	 * to its format; generic pixel format transforms are handled by
	 * the caller.
	 **/
	Status (*transform)(Tex* t, size_t transforms);

	/**
	 * indicate if the data appears to be an instance of this codec's header,
	 * i.e. can this codec decode it?
	 *
	 * @param file input data; only guaranteed to be 4 bytes!
	 * (this should be enough to examine the header's 'magic' field)
	 * @return bool
	 **/
	bool (*is_hdr)(const u8* file);

	/**
	 * is the extension that of a file format supported by this codec?
	 *
	 * rationale: cannot just return the extension string and have
	 * caller compare it (-> smaller code) because a codec's file format
	 * may have several valid extensions (e.g. jpg and jpeg).
	 *
	 * @param extension (including '.')
	 * @return bool
	 **/
	bool (*is_ext)(const OsPath& extension);

	/**
	 * return size of the file header supported by this codec.
	 *
	 * @param file the specific header to return length of (taking its
	 * variable-length fields into account). if NULL, return minimum
	 * guaranteed header size, i.e. the header without any
	 * variable-length fields.
	 * @return size [bytes]
	 **/
	size_t (*hdr_size)(const u8* file);

	/**
	 * name of codec for debug purposes. typically set via TEX_CODEC_REGISTER.
	 **/
	const wchar_t* name;

	/**
	 * intrusive linked-list of codecs: more convenient than fixed-size
	 * static storage.
	 * set by caller; should be initialized to NULL.
	 **/
	const TexCodecVTbl* next;
};


/**
 * build codec vtbl and register it. the codec will be queried for future
 * texture load requests. call order is undefined, but since each codec
 * only steps up if it can handle the given format, this is not a problem.
 *
 * @param name identifier of codec (not string!). used to bind 'member'
 * functions prefixed with it to the vtbl, and as the TexCodecVTbl name.
 * it should also mirror the default file extension (e.g. dds) -
 * this is relied upon (but verified) in the self-test.
 *
 * usage: at file scope within the source file containing the codec's methods.
 **/
#define TEX_CODEC_REGISTER(name)\
	static TexCodecVTbl UID__ = \
	{\
		name##_decode, name##_encode, name##_transform,\
		name##_is_hdr, name##_is_ext, name##_hdr_size,\
		WIDEN(#name)\
	};\
	/*static int dummy = tex_codec_register(&vtbl);*/\
	/* note: when building as a static library, pre-main initializers */\
	/* will not run! as a workaround, we build an externally visible */\
	/* registration function that must be called via */\
	/* tex_codec_register_all - see comments there. */\
	void name##_register() { tex_codec_register(&UID__); }


/**
 * add this vtbl to the codec list. called at NLSO init time by the
 * TEX_CODEC_REGISTER in each codec file.
 * order in list is unspecified; see TEX_CODEC_REGISTER.
 *
 * @param c pointer to vtbl.
 * @return int (allows calling from a macro at file scope; value is not used)
 **/
extern int tex_codec_register(TexCodecVTbl* c);


/**
 * Find codec that recognizes the desired output file extension.
 *
 * @param extension
 * @param c (out) vtbl of responsible codec
 * @return Status; ERR::RES_UNKNOWN_FORMAT (without warning, because this is
 * called by tex_is_known_extension) if no codec indicates they can
 * handle the given extension.
 **/
extern Status tex_codec_for_filename(const OsPath& extension, const TexCodecVTbl** c);

/**
 * find codec that recognizes the header's magic field.
 *
 * @param data typically contents of file, but need only include the
 * (first 4 bytes of) header.
 * @param data_size [bytes]
 * @param c (out) vtbl of responsible codec
 * @return Status; ERR::RES_UNKNOWN_FORMAT if no codec indicates they can
 * handle the given format (header).
 **/
extern Status tex_codec_for_header(const u8* data, size_t data_size, const TexCodecVTbl** c);

/**
 * enumerate all registered codecs.
 *
 * used by self-test to test each one of them in turn.
 *
 * @param prev_codec the last codec returned by this function.
 * pass 0 the first time.
 * note: this routine is stateless and therefore reentrant.
 * @return the next codec, or 0 if all have been returned.
 **/
extern const TexCodecVTbl* tex_codec_next(const TexCodecVTbl* prev_codec);

/**
 * transform the texture's pixel format.
 * tries each codec's transform method once, or until one indicates success.
 *
 * @param t texture object
 * @param transforms: OR-ed combination of TEX_* flags that are to
 * be changed.
 * @return Status
 **/
extern Status tex_codec_transform(Tex* t, size_t transforms);

/**
 * allocate an array of row pointers that point into the given texture data.
 * for texture decoders that support output via row pointers (e.g. PNG),
 * this allows flipping the image vertically (useful when matching bottom-up
 * textures to a global orientation) directly, which is much more
 * efficient than transforming later via copying all pixels.
 *
 * @param data the texture data into which row pointers will point.
 * note: we don't allocate it here because this function is
 * needed for encoding, too (where data is already present).
 * @param h height [pixels] of texture.
 * @param pitch size [bytes] of one texture row, i.e. width*bytes_per_pixel.
 * @param src_flags TexFlags of source texture. used to extract its
 * orientation.
 * @param dst_orientation desired orientation of the output data.
 * can be one of TEX_BOTTOM_UP, TEX_TOP_DOWN, or 0 for the
 * "global orientation".
 * depending on src and dst, the row array is flipped if necessary.
 **/
typedef const u8* RowPtr;
extern std::vector<RowPtr> tex_codec_alloc_rows(const u8* data, size_t h, size_t pitch, size_t src_flags, size_t dst_orientation);

/**
 * apply transforms and then copy header and image into output buffer.
 *
 * @param t input texture object
 * @param transforms transformations to be applied to pixel format
 * @param hdr header data
 * @param hdr_size [bytes]
 * @param da output data array (will be expanded as necessary)
 * @return Status
 **/
extern Status tex_codec_write(Tex* t, size_t transforms, const void* hdr, size_t hdr_size, DynArray* da);

#endif	 // #ifndef INCLUDED_TEX_CODEC
