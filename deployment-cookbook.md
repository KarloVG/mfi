# Deployment Teched MFI frontenda
-----


#### Priprema
* U **Remote Desktop Manageru** stvoriti novu konekciju
* Pod **User Interface** podesiti konekciju:
    * Host: 95.217.109.236
    * Username: Administrator
    * Password: upisati administratorski password
    * Store password locally: CHECKED
* Na **Display** tabu podesiti screen sizing mode na _Smart sizing_
* Na **Local resources** tabu, pod **Local Devices and Resources** checkirati _Hard drives_ i _Clipboard_
* Lokalno povući repo s gita, pokrenuti rebuild frontenda s `ng build --prod`


#### Deploy
* **Lokalno** otvoriti folder `/dist/teched-frontend`, označiti sve, kopirati na clipboard
* **Na serveru** unutar remote desktop konekcije otvoriti `mfi_frontend` folder, obrisati sve
* **Na serveru** unutar remote deksop konekcije kopirati iz clipboarda u prazan `mfi_frontend` folder 