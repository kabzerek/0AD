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

#ifndef INCLUDED_ICMPTECHNOLOGYTEMPLATEMANAGER
#define INCLUDED_ICMPTECHNOLOGYTEMPLATEMANAGER

#include "simulation2/system/Interface.h"

#include "maths/Fixed.h"

/**
 * Technology template manager interface.
 * (This interface only includes the functions needed by native code for accessing
 *	technology template data, the associated logic is handled in scripts)
 */
class ICmpTechnologyTemplateManager : public IComponent
{
public:
	virtual CScriptVal GetAllTechs() = 0;

	DECLARE_INTERFACE_TYPE(TechnologyTemplateManager)
};

#endif // INCLUDED_ICMPTECHNOLOGYTEMPLATEMANAGER
