/* Copyright (C) 2009 Wildfire Games.
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

/*
Pyrogenesis.h

Standard declarations which are included in all projects.
*/

#ifndef INCLUDED_PYROGENESIS
#define INCLUDED_PYROGENESIS

#include "lib/os_path.h"

// overrides ah_translate. registered in GameSetup.cpp
extern const wchar_t* psTranslate(const wchar_t* text);
extern void psTranslateFree(const wchar_t* text);
extern void psBundleLogs(FILE* f);

extern void psSetLogDir(const OsPath& logDir);	// set during InitVfs
extern const OsPath& psLogDir();	// used by AppHooks and engine code when reporting errors

#endif
