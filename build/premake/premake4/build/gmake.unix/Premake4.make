# GNU Make project makefile autogenerated by Premake
ifndef config
  config=release
endif

ifndef verbose
  SILENT = @
endif

ifndef CC
  CC = gcc
endif

ifndef CXX
  CXX = g++
endif

ifndef AR
  AR = ar
endif

ifeq ($(config),release)
  OBJDIR     = obj/Release
  TARGETDIR  = ../../bin/release
  TARGET     = $(TARGETDIR)/premake4
  DEFINES   += -DNDEBUG -DLUA_USE_POSIX -DLUA_USE_DLOPEN
  INCLUDES  += -I../../src/host/lua-5.1.4/src
  CPPFLAGS  += -MMD -MP $(DEFINES) $(INCLUDES)
  CFLAGS    += $(CPPFLAGS) -Wall -Os
  CXXFLAGS  += $(CPPFLAGS) -Wall -Os
  LDFLAGS   += -s -rdynamic
  LIBS      += -lm -ldl 
  RESFLAGS  += $(DEFINES) $(INCLUDES) 
  LDDEPS    += 
  LINKCMD    = $(CC) -o $(TARGET) $(OBJECTS) $(LDFLAGS) $(RESOURCES) $(LDDEPS) $(LIBS)
  define PREBUILDCMDS
  endef
  define PRELINKCMDS
  endef
  define POSTBUILDCMDS
  endef
endif

ifeq ($(config),debug)
  OBJDIR     = obj/Debug
  TARGETDIR  = ../../bin/debug
  TARGET     = $(TARGETDIR)/premake4
  DEFINES   += -D_DEBUG -DLUA_USE_POSIX -DLUA_USE_DLOPEN
  INCLUDES  += -I../../src/host/lua-5.1.4/src
  CPPFLAGS  += -MMD -MP $(DEFINES) $(INCLUDES)
  CFLAGS    += $(CPPFLAGS) -Wall -g
  CXXFLAGS  += $(CPPFLAGS) -Wall -g
  LDFLAGS   += -rdynamic
  LIBS      += -lm -ldl 
  RESFLAGS  += $(DEFINES) $(INCLUDES) 
  LDDEPS    += 
  LINKCMD    = $(CC) -o $(TARGET) $(OBJECTS) $(LDFLAGS) $(RESOURCES) $(LDDEPS) $(LIBS)
  define PREBUILDCMDS
  endef
  define PRELINKCMDS
  endef
  define POSTBUILDCMDS
  endef
endif

OBJECTS := \
	$(OBJDIR)/path_isabsolute.o \
	$(OBJDIR)/os_getversion.o \
	$(OBJDIR)/os_isfile.o \
	$(OBJDIR)/os_uuid.o \
	$(OBJDIR)/os_chdir.o \
	$(OBJDIR)/os_pathsearch.o \
	$(OBJDIR)/os_rmdir.o \
	$(OBJDIR)/os_match.o \
	$(OBJDIR)/scripts.o \
	$(OBJDIR)/os_copyfile.o \
	$(OBJDIR)/os_isdir.o \
	$(OBJDIR)/os_mkdir.o \
	$(OBJDIR)/os_getcwd.o \
	$(OBJDIR)/premake.o \
	$(OBJDIR)/string_endswith.o \
	$(OBJDIR)/loadlib.o \
	$(OBJDIR)/ldebug.o \
	$(OBJDIR)/lstring.o \
	$(OBJDIR)/lparser.o \
	$(OBJDIR)/lfunc.o \
	$(OBJDIR)/ldump.o \
	$(OBJDIR)/liolib.o \
	$(OBJDIR)/lgc.o \
	$(OBJDIR)/lundump.o \
	$(OBJDIR)/lopcodes.o \
	$(OBJDIR)/lmem.o \
	$(OBJDIR)/lstate.o \
	$(OBJDIR)/ltm.o \
	$(OBJDIR)/ldo.o \
	$(OBJDIR)/lzio.o \
	$(OBJDIR)/lstrlib.o \
	$(OBJDIR)/lapi.o \
	$(OBJDIR)/lbaselib.o \
	$(OBJDIR)/ltablib.o \
	$(OBJDIR)/llex.o \
	$(OBJDIR)/loslib.o \
	$(OBJDIR)/ltable.o \
	$(OBJDIR)/linit.o \
	$(OBJDIR)/ldblib.o \
	$(OBJDIR)/lmathlib.o \
	$(OBJDIR)/lobject.o \
	$(OBJDIR)/lvm.o \
	$(OBJDIR)/lcode.o \
	$(OBJDIR)/lauxlib.o \

RESOURCES := \

SHELLTYPE := msdos
ifeq (,$(ComSpec)$(COMSPEC))
  SHELLTYPE := posix
endif
ifeq (/bin,$(findstring /bin,$(SHELL)))
  SHELLTYPE := posix
endif

.PHONY: clean prebuild prelink

all: $(TARGET)
	@:

$(TARGET): $(OBJECTS) $(LDDEPS) $(RESOURCES) | prelink
	@echo Linking Premake4
	$(SILENT) $(LINKCMD)
	$(POSTBUILDCMDS)

$(TARGETDIR):
	@echo Creating $(TARGETDIR)
ifeq (posix,$(SHELLTYPE))
	$(SILENT) mkdir -p $(TARGETDIR)
else
	$(SILENT) mkdir $(subst /,\\,$(TARGETDIR))
endif

$(OBJDIR):
	@echo Creating $(OBJDIR)
ifeq (posix,$(SHELLTYPE))
	$(SILENT) mkdir -p $(OBJDIR)
else
	$(SILENT) mkdir $(subst /,\\,$(OBJDIR))
endif

clean:
	@echo Cleaning Premake4
ifeq (posix,$(SHELLTYPE))
	$(SILENT) rm -f  $(TARGET)
	$(SILENT) rm -rf $(OBJDIR)
else
	$(SILENT) if exist $(subst /,\\,$(TARGET)) del $(subst /,\\,$(TARGET))
	$(SILENT) if exist $(subst /,\\,$(OBJDIR)) rmdir /s /q $(subst /,\\,$(OBJDIR))
endif

prebuild: $(TARGETDIR) $(OBJDIR)
	$(PREBUILDCMDS)

prelink:
	$(PRELINKCMDS)

ifneq (,$(PCH))
$(GCH): $(PCH) | $(OBJDIR)
	@echo $(notdir $<)
	-$(SILENT) cp $< $(OBJDIR)
	$(SILENT) $(CC) $(CFLAGS) -o "$@" -c "$<"
endif

$(OBJDIR)/path_isabsolute.o: ../../src/host/path_isabsolute.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/path_isabsolute.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/os_getversion.o: ../../src/host/os_getversion.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/os_getversion.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/os_isfile.o: ../../src/host/os_isfile.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/os_isfile.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/os_uuid.o: ../../src/host/os_uuid.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/os_uuid.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/os_chdir.o: ../../src/host/os_chdir.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/os_chdir.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/os_pathsearch.o: ../../src/host/os_pathsearch.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/os_pathsearch.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/os_rmdir.o: ../../src/host/os_rmdir.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/os_rmdir.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/os_match.o: ../../src/host/os_match.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/os_match.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/scripts.o: ../../src/host/scripts.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/scripts.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/os_copyfile.o: ../../src/host/os_copyfile.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/os_copyfile.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/os_isdir.o: ../../src/host/os_isdir.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/os_isdir.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/os_mkdir.o: ../../src/host/os_mkdir.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/os_mkdir.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/os_getcwd.o: ../../src/host/os_getcwd.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/os_getcwd.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/premake.o: ../../src/host/premake.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/premake.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/string_endswith.o: ../../src/host/string_endswith.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/string_endswith.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/loadlib.o: ../../src/host/lua-5.1.4/src/loadlib.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/loadlib.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/ldebug.o: ../../src/host/lua-5.1.4/src/ldebug.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/ldebug.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lstring.o: ../../src/host/lua-5.1.4/src/lstring.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lstring.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lparser.o: ../../src/host/lua-5.1.4/src/lparser.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lparser.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lfunc.o: ../../src/host/lua-5.1.4/src/lfunc.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lfunc.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/ldump.o: ../../src/host/lua-5.1.4/src/ldump.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/ldump.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/liolib.o: ../../src/host/lua-5.1.4/src/liolib.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/liolib.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lgc.o: ../../src/host/lua-5.1.4/src/lgc.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lgc.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lundump.o: ../../src/host/lua-5.1.4/src/lundump.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lundump.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lopcodes.o: ../../src/host/lua-5.1.4/src/lopcodes.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lopcodes.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lmem.o: ../../src/host/lua-5.1.4/src/lmem.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lmem.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lstate.o: ../../src/host/lua-5.1.4/src/lstate.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lstate.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/ltm.o: ../../src/host/lua-5.1.4/src/ltm.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/ltm.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/ldo.o: ../../src/host/lua-5.1.4/src/ldo.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/ldo.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lzio.o: ../../src/host/lua-5.1.4/src/lzio.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lzio.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lstrlib.o: ../../src/host/lua-5.1.4/src/lstrlib.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lstrlib.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lapi.o: ../../src/host/lua-5.1.4/src/lapi.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lapi.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lbaselib.o: ../../src/host/lua-5.1.4/src/lbaselib.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lbaselib.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/ltablib.o: ../../src/host/lua-5.1.4/src/ltablib.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/ltablib.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/llex.o: ../../src/host/lua-5.1.4/src/llex.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/llex.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/loslib.o: ../../src/host/lua-5.1.4/src/loslib.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/loslib.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/ltable.o: ../../src/host/lua-5.1.4/src/ltable.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/ltable.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/linit.o: ../../src/host/lua-5.1.4/src/linit.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/linit.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/ldblib.o: ../../src/host/lua-5.1.4/src/ldblib.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/ldblib.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lmathlib.o: ../../src/host/lua-5.1.4/src/lmathlib.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lmathlib.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lobject.o: ../../src/host/lua-5.1.4/src/lobject.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lobject.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lvm.o: ../../src/host/lua-5.1.4/src/lvm.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lvm.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lcode.o: ../../src/host/lua-5.1.4/src/lcode.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lcode.d -MT "$@" -o "$@" -c "$<"
$(OBJDIR)/lauxlib.o: ../../src/host/lua-5.1.4/src/lauxlib.c $(GCH) | prebuild
	@echo $(notdir $<)
	$(SILENT) $(CC) $(PCHINCLUDES) $(CFLAGS) -MF $(OBJDIR)/lauxlib.d -MT "$@" -o "$@" -c "$<"

-include $(OBJECTS:%.o=%.d)
-include $(GCH:%.h.gch=%.h.d)