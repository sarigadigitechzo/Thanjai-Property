from ftplib import FTP
ftp = FTP('192.250.226.161')
ftp.login('thanjaiportal', 'p2NIHq&Wy')
print(ftp.nlst())
ftp.quit()
