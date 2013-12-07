/* Copyright (C) 2012 Wildfire Games.
 * This file is part of 0 A.D.
 *
 * 0 A.D. is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * 0 A.D. is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with 0 A.D.  If not, see <http://www.gnu.org/licenses/>.
 */

#ifndef INCLUDED_SCRIPTTYPES
#define INCLUDED_SCRIPTTYPES

#ifdef _WIN32
# define XP_WIN
# ifndef WIN32
#  define WIN32 // SpiderMonkey expects this
# endif

// The jsval struct type causes crashes due to weird miscompilation
// issues in (at least) VC2008, so force it to be the less-type-safe
// non-struct type instead
# define JS_NO_JSVAL_JSID_STRUCT_TYPES

// Make JS think the int8_t etc types are defined, since wposix_types.h emulates
// the ones that are needed and this avoids conflicting definitions
# define JS_SYS_TYPES_H_DEFINES_EXACT_SIZE_TYPES

#else // If not Windows, then Unix:

# define XP_UNIX

// In DEBUG mode, jsval defaults to struct types. Normally we build separate
// debug/release mode versions of the library, but when using --with-system-mozjs185
// it's always a release mode library, so we have to disable struct types for
// ABI compatibility
# if defined(DEBUG) && defined(WITH_SYSTEM_MOZJS185)
#  define JS_NO_JSVAL_JSID_STRUCT_TYPES
# endif

#endif
// (we don't support XP_OS2 or XP_BEOS)


// Guess whether the library was compiled with the release-mode or debug-mode ABI
// (for JS_DumpHeap etc)
#if defined(DEBUG) && !defined(WITH_SYSTEM_MOZJS185)
# define MOZJS_DEBUG_ABI 1
#else
# define MOZJS_DEBUG_ABI 0
#endif


#include <cstring> // required by jsutil.h

// SpiderMonkey wants the DEBUG flag
#ifndef NDEBUG
# ifndef DEBUG
#  define DEBUG
# endif
#endif

// Ignore some harmless warnings triggered by jsapi.h
#if GCC_VERSION >= 402 // (older GCCs don't support this pragma)
# pragma GCC diagnostic ignored "-Wunused-parameter"
# pragma GCC diagnostic ignored "-Wredundant-decls"
#endif
#if MSC_VERSION
# pragma warning(push)
# pragma warning(disable:4480) // "nonstandard extension used: specifying underlying type for enum"
# pragma warning(disable:4100) // "unreferenced formal parameter"
#endif

#include "js/jsapi.h"

#if MSC_VERSION
# pragma warning(pop)
#endif
#if GCC_VERSION >= 402
# pragma GCC diagnostic warning "-Wunused-parameter"
# pragma GCC diagnostic warning "-Wredundant-decls"
#endif

#if JS_VERSION != 185
#error Your compiler is trying to use an incorrect version of the SpiderMonkey library.
#error The only version that works is the one in the libraries/spidermonkey/ directory,
#error and it will not work with a typical system-installed version.
#error Make sure you have got all the right files and include paths.
#endif

class ScriptInterface;
class CScriptVal;
class CScriptValRooted;

#endif // INCLUDED_SCRIPTTYPES
