# ┌────────────────────────────────────────────────────────────────────────────┐
# │Makefile                                               _TAG (260727:02h:59) │
# ├────────────────────────────────────────────────────────────────────────────┤
-include $(APROJECTS)/Makefile                        #   $APROJECTS/Makefile
# └────────────────────────────────────────────────────────────────────────────┘


:cd %:h|up|only|set columns=999|vert terminal ++cols=170 make archive
#   $BROWSEEXT/vimium/Makefile
archive:
	@(\
	echo "[$@]";\
	find . -type f -mtime -30 | grep -w -v git;\
	echo;\
	DATE=`date '+%y%m%d'`;\
	ARCHIVE="../layout_browser_$$DATE.zip";\
	FILES="layout_browser.html javascript stylesheet";\
	jar Mcf $$ARCHIVE $$FILES;\
	)

#       rar a layout_browser.rar layout_browser.html javascript stylesheet;\

FTP = C:/WINDOWS/system32/ftp.exe

p ftpRP ftp_remotetabs_PUT: #{{{
	@(\
	    echo "[$@]";\
	    $(FTP) -n -i -w:1024 -s:C:/LOCAL/GAMES/IVANWFR/INPUT/TWIDDLER/GitHub/Twiddler3-Layout/ftp_remotetabs_PUT.txt;\
	    )
# }}}
:cd %:h:make p
:new C:/LOCAL/GAMES/IVANWFR/INPUT/TWIDDLER/GitHub/Twiddler3-Layout/ftp_remotetabs_PUT.txt
:set columns=999|:only|vert terminal ++cols=200 make p
