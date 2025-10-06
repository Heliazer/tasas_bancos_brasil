### - cd /root/tasas_bancos_brasil/simulador-factoring && pwd && ls -la
heliazer@CCUBUNTO:~/tasas_bancos_brasil/simulador-factoring$ pwd
/home/heliazer/tasas_bancos_brasil/simulador-factoring
bash: parse_git_branch: command not found
heliazer@CCUBUNTO:~/tasas_bancos_brasil/simulador-factoring$ ls -la
total 220
drwxr-xr-x   6 heliazer heliazer   4096 Oct  3 23:18 .
drwxr-xr-x   7 heliazer heliazer   4096 Oct  3 23:18 ..
-rw-r--r--   1 root     root        405 Oct  3 21:02 deploy.sh
drwxr-xr-x   3 heliazer heliazer   4096 Oct  3 22:12 dist
-rw-r--r--   1 heliazer heliazer    621 Oct  3 10:43 eslint.config.js
-rw-r--r--   1 heliazer heliazer    253 Oct  3 10:43 .gitignore
-rw-r--r--   1 heliazer heliazer    368 Oct  3 10:43 index.html
drwxr-xr-x 164 heliazer heliazer   4096 Oct  5 16:35 node_modules
-rw-r--r--   1 heliazer heliazer   1091 Oct  5 16:32 package.json
-rw-r--r--   1 heliazer heliazer 145820 Oct  5 16:32 package-lock.json
-rw-r--r--   1 heliazer heliazer     91 Oct  3 10:43 postcss.config.js
drwxr-xr-x   2 heliazer heliazer   4096 Oct  3 10:43 public
-rw-r--r--   1 heliazer heliazer   4922 Oct  3 10:43 README.md
drwxr-xr-x   7 heliazer heliazer   4096 Oct  3 23:18 src
-rw-r--r--   1 heliazer heliazer    501 Oct  3 10:43 tailwind.config.js
-rw-r--r--   1 heliazer heliazer    700 Oct  3 10:43 tsconfig.app.json
-rw-r--r--   1 heliazer heliazer    119 Oct  3 10:43 tsconfig.json
-rw-r--r--   1 heliazer heliazer    653 Oct  3 10:43 tsconfig.node.json
-rw-r--r--   1 heliazer heliazer    161 Oct  3 10:43 vite.config.ts
bash: parse_git_branch: command not found
heliazer@CCUBUNTO:~/tasas_bancos_brasil/simulador-factoring$ 

### - ps aux | grep -i vite
heliazer@CCUBUNTO:~/tasas_bancos_brasil/simulador-factoring$ ps aux | grep -i vite
heliazer    2104  0.0  0.0   6332  2088 pts/0    S+   16:45   0:00 grep -i vite

### - netstat -tulpn
heliazer@CCUBUNTO:~/tasas_bancos_brasil/simulador-factoring$ sudo netstat -tulpn
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      752/sshd: /usr/sbin 
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      695/nginx: master p 
tcp6       0      0 :::3389                 :::*                    LISTEN      727/xrdp            
tcp6       0      0 ::1:3350                :::*                    LISTEN      687/xrdp-sesman     
tcp6       0      0 :::22                   :::*                    LISTEN      752/sshd: /usr/sbin 
udp        0      0 0.0.0.0:5353            0.0.0.0:*                           659/avahi-daemon: r 
udp        0      0 0.0.0.0:40533           0.0.0.0:*                           659/avahi-daemon: r 
udp6       0      0 :::50266                :::*                                659/avahi-daemon: r 
udp6       0      0 :::5353                 :::*                                659/avahi-daemon: r 

