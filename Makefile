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
