/*
DoF with bokeh GLSL shader v2.4
by Martins Upitis (martinsh) (devlog-martinsh.blogspot.com)

----------------------
The shader is Blender Game Engine ready, but it should be quite simple to adapt for your engine.

This work is licensed under a Creative Commons Attribution 3.0 Unported License.
So you are free to share, modify and adapt it for your needs, and even use it for commercial use.
I would also love to hear about a project you are using it.

Have fun,
Martins
----------------------

changelog:

2.4:
- physically accurate DoF simulation calculated from "focalDepth" ,"focalLength", "f-stop" and "CoC" parameters.
- option for artist controlled DoF simulation calculated only from "focalDepth" and individual controls for near and far blur
- added "circe of confusion" (CoC) parameter in mm to accurately simulate DoF with different camera sensor or film sizes
- cleaned up the code
- some optimization

2.3:
- new and physically little more accurate DoF
- two extra input variables - focal length and aperture iris diameter
- added a debug visualization of focus point and focal range

2.1:
- added an option for pentagonal bokeh shape
- minor fixes

2.0:
- variable sample count to increase quality/performance
- option to blur depth buffer to reduce hard edges
- option to dither the samples with noise or pattern
- bokeh chromatic aberration/fringing
- bokeh bias to bring out bokeh edges
- image thresholding to bring out highlights when image is out of focus

----------------------
Changes from original shader:

- Changed names of samplers and values to their equivalents in 0 A.D.'s postproc manager.
- Moved user variables into HQDOF.xml defines and modified their values.
- Removed an optimization that caused lines to appear on the edges of the (mostly) focused area.
- Removed pentagon-shaped bokeh code.
- Made manual DOF scale with zoom.
- Moved blur level calculation to its own function.
- Added code to remove a blurred halo-like outline around focused foreground objects.
- Renamed some variables to make the code more readable.
----------------------

*/

uniform sampler2D renderedTex;
uniform sampler2D depthTex;
uniform float width;
uniform float height;

#define PI  3.14159265

vec2 texel = vec2(1.0/width,1.0/height);

uniform float focalDepth;  //focal distance value in meters, but you may use autofocus option below
//uniform float focalLength = 1000; //focal length in mm
//uniform float fstop = 200; //f-stop value
uniform bool showFocus = false; //show debug focus point and focal range (red = focal point, green = focal range)

/*
make sure that these two values are the same for your camera, otherwise distances will be wrong.
*/

//float znear = 0.5; //camera clipping start
//float zfar = 100.0; //camera clipping end
uniform float zNear;
uniform float zFar;

bool foregroundcleanup = true;

//------------------------------------------
//user variables

//int samples = 3; //samples on the first ring
//int rings = 3; //ring count

//bool manualdof = false; //manual dof calculation
//float ndofstart = 10.0; //near dof falloff start
//float ndofdist = 35.0; //near dof falloff distance
//float fdofstart = 8.0; //far dof falloff start
//float fdofdist = 40.0; //far dof falloff distance

float CoC = 0.03;//circle of confusion size in mm (35mm film = 0.03mm)

bool vignetting = false; //use optical lens vignetting?
float vignout = 1.3; //vignetting outer border
float vignin = 0.5; //vignetting inner border
float vignfade = 22.0; //f-stops till vignete fades

bool autofocus = true; //use autofocus in shader? disable if you use external focalDepth value
vec2 focus = vec2(0.5,0.5); // autofocus point on screen (0.0,0.0 - left lower corner, 1.0,1.0 - upper right)
//float maxblur = 2.0; //clamp value of max blur (0.0 = no blur,1.0 default)

//float threshold = 0.9; //highlight threshold;
//float gain = 2.0; //highlight gain;

//float bias = 0.5; //bokeh edge bias
//float fringe = 0.7; //bokeh chromatic aberration/fringing

bool noise = true; //use noise instead of pattern for sample dithering
float namount = 0.0001; //dither amount

bool depthblur = false; //blur the depth buffer?
float dbsize = 1.25; //depthblursize

//------------------------------------------

float bdepth(vec2 coords, float blursize) //blurring depth
{
	float d = 0.0;
	float div = 0;
	float kernel[9];
	vec2 offset[9];

	vec2 wh = vec2(texel.x, texel.y) * blursize;

	offset[0] = vec2(-wh.x,-wh.y);
	offset[1] = vec2( 0.0, -wh.y);
	offset[2] = vec2( wh.x -wh.y);

	offset[3] = vec2(-wh.x,  0.0);
	offset[4] = vec2( 0.0,   0.0);
	offset[5] = vec2( wh.x,  0.0);

	offset[6] = vec2(-wh.x, wh.y);
	offset[7] = vec2( 0.0,  wh.y);
	offset[8] = vec2( wh.x, wh.y);

	kernel[0] = 1.0/16.0;   kernel[1] = 2.0/16.0;   kernel[2] = 1.0/16.0;
	kernel[3] = 2.0/16.0;   kernel[4] = 4.0/16.0;   kernel[5] = 2.0/16.0;
	kernel[6] = 1.0/16.0;   kernel[7] = 2.0/16.0;   kernel[8] = 1.0/16.0;

	float depth = texture2D(depthTex, coords).r;

	for( int i=0; i<9; i++ )
	{
		float tmp = texture2D(depthTex, coords + offset[i]).r;

		if (tmp <= depth)
		{
			d += tmp * kernel[i];
			div += kernel[i];
		}
	}

	return d / div;
}

vec3 color(vec2 coords,float blur) //processing the sample
{
	vec3 col = vec3(0.0);

	col.r = texture2D(renderedTex,coords + (vec2(0.0,1.0)*texel*fringe*blur)).r;
	col.g = texture2D(renderedTex,coords + (vec2(-0.866,-0.5)*texel*fringe*blur)).g;
	col.b = texture2D(renderedTex,coords + (vec2(0.866,-0.5)*texel*fringe*blur)).b;

	vec3 lumcoeff = vec3(0.299,0.587,0.114);
	float lum = dot(col.rgb, lumcoeff);
	float thresh = max((lum-threshold)*gain, 0.0);
	return col+mix(vec3(0.0),col,thresh*blur);
}

vec2 rand(vec2 coord) //generating noise/pattern texture for dithering
{
	float noiseX = ((fract(1.0-coord.s*(width/2.0))*0.25)+(fract(coord.t*(height/2.0))*0.75))*2.0-1.0;
	float noiseY = ((fract(1.0-coord.s*(width/2.0))*0.75)+(fract(coord.t*(height/2.0))*0.25))*2.0-1.0;

	if (noise)
	{
		noiseX = clamp(fract(sin(dot(coord ,vec2(12.9898,78.233))) * 43758.5453),0.0,1.0)*2.0-1.0;
		noiseY = clamp(fract(sin(dot(coord ,vec2(12.9898,78.233)*2.0)) * 43758.5453),0.0,1.0)*2.0-1.0;
	}
	return vec2(noiseX,noiseY);
}

vec3 debugFocus(vec3 col, float blur, float depth)
{
    float edge = 0.002*depth; //distance based edge smoothing
	float m = clamp(smoothstep(0.0,edge,blur),0.0,1.0);
	float e = clamp(smoothstep(1.0-edge,1.0,blur),0.0,1.0);

	col = mix(col,vec3(1.0,0.5,0.0),(1.0-m)*0.6);
    col = mix(col,vec3(0.0,0.5,1.0),((1.0-e)-(1.0-m))*0.2);

	return col;
}

float linearize(float depth)
{
	return -zFar * zNear / (depth * (zFar - zNear) - zFar);
}

float vignette()
{
	float dist = distance(gl_TexCoord[3].xy, vec2(0.5,0.5));
	dist = smoothstep(vignout+(fstop/vignfade), vignin+(fstop/vignfade), dist);
	return clamp(dist,0.0,1.0);
}

float bluramount(float depth, float fDepth)
{
	float blur;

	if (manualdof)
	{
		float a = depth-fDepth; //focal plane
		float b = (a-fdofstart)/fdofdist; //far DoF
		float c = (-a-ndofstart)/ndofdist; //near Dof
		blur = (a>0.0)?b:c;
		blur /= max((fDepth / 15) - 7, 1);
	}
	else
	{
		float f = focalLength; //focal length in mm
		float d = fDepth*1000.0; //focal plane in mm
		float o = depth*1000.0; //depth in mm

		float a = (o*f)/(o-f);
		float b = (d*f)/(d-f);
		float c = (d-f)/(d*fstop*CoC);

		blur = abs(a-b)*c;
	}

	return clamp(blur, 0, 1);
}

varying vec2 v_tex;

void main()
{
	//scene depth calculation

	float depth;

	if (depthblur)
	{
		depth = linearize(bdepth(v_tex, dbsize));
	}
	else
	{
		depth = linearize(texture2D(depthTex,v_tex).x);
	}

	//focal plane calculation

	float fDepth = focalDepth;

	if (autofocus)
	{
		fDepth = linearize(texture2D(depthTex,focus).x);
	}

	//dof blur factor calculation

	float blur = bluramount(depth, fDepth);

	// calculation of pattern for ditering

	vec2 noise = rand(v_tex)*namount*blur;

	// getting blur x and y step factor

	float w = texel.x*blur*maxblur+noise.x;
	float h = texel.y*blur*maxblur+noise.y;

	float w2 = texel.x*maxblur+noise.x;
	float h2 = texel.y*maxblur+noise.y;

	// calculation of final color
    vec3 color = texture2D(renderedTex, v_tex).rgb;
    vec3 samplecolor = color;
	float samplediv = 1.0;

	int ringsamples;

	for (int i = 1; i <= rings; i += 1)
	{
		ringsamples = i * samples;
		float step = PI*2.0 / ringsamples;

		for (int j = 0; j < ringsamples; j += 1)
		{
			// find sample coordinates
			float pw = (cos(j*step)*i);
			float ph = (sin(j*step)*i);

			vec2 samplecoord = v_tex + vec2(pw*w,ph*h);

			// set this sample's color and count
			vec3 samplecoloradd = color(samplecoord,blur)*mix(1.0,i/rings,bias);
			float sampledivadd = mix(1.0,i/rings,bias);

			// begin performance-unfriendly (but nice-looking) removal of fully-focused foreground samples
			if (foregroundcleanup)
			{
				float sampledepth = linearize(texture2D(depthTex, samplecoord).x);
				int depthweight = (sampledepth > depth) ? 1 : 0;
				float sampleblur = bluramount(sampledepth, fDepth);

				float weight = clamp(depthweight + sampleblur, 0, 1);
				samplecoloradd *= weight;
				sampledivadd *= weight;
			}

			// add sample values
			samplecolor += samplecoloradd;
			samplediv += sampledivadd;
		}

/*#define BLURONSHARPCHECK
		#ifdef BLURONSHARPCHECK
		for (int k = j; k < ringsamples * 2; k += 1)
		{
			float pw = (cos(k*step)*i);
			float ph = (sin(k*step)*i);

			vec2 samplecoord = v_tex + vec2(pw*w2,ph*h2);

			float sampledepth = linearize(texture2D(depthTex, samplecoord).x);
			int depthweight = (sampledepth > depth) ? 0 : 1;
			float sampleblur = bluramount(sampledepth, fDepth);

			vec3 coladd = color(samplecoord,sampleblur)*mix(1.0,i/rings,bias);
			float sadd = mix(1.0,i/rings,bias);

			float weight = (sampleblur > blur) ? clamp(depthweight * (0.2 - blur) * (float(k) / ringsamples / 2) * sampleblur, 0, 1) : 0.0;
			coladd *= weight;
			sadd *= weight;

			samplecolor += coladd;
			samplediv += sadd;
		}
		#endif*/
	}

	samplecolor /= samplediv; //divide by sample count

	if (showFocus)
	{
	    samplecolor = debugFocus(samplecolor, blur, depth);
	}

	if (vignetting)
	{
	    samplecolor *= vignette();
	}

	gl_FragColor.rgb = samplecolor;
	gl_FragColor.a = 1.0;

	#ifdef DEBUGVISUALIZATION
	gl_FragColor.rgb = vec3(20 - (texture2D(depthTex, v_tex).x * 20));

	if (v_tex.x < 0.501 && v_tex.x > 0.499)
	{
		gl_FragColor.rgb += vec3(0.1);
	}
	if (v_tex.y < 0.501 && v_tex.y > 0.499)
	{
		gl_FragColor.rgb += vec3(0.1);
	}

	if (blur == 0)
	{
		gl_FragColor.rgb += vec3(0.05);
	}
	#endif
}