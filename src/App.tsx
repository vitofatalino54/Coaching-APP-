import React, { useState, useEffect } from "react";

/* ==================================================================
   CORDA — baseline sito v3
   Piattaforma di coaching per iRacing.

   ---- COME CARICARE I TUOI MEDIA ----
   Metti l'URL del file dentro MEDIA qui sotto, accanto al codice dello
   slot. Il placeholder sparisce da solo e al suo posto compare il tuo
   video (in loop, muto) o la tua immagine. Non serve toccare altro.

   Esempio:  V01: "https://.../onboard-monza.mp4",
   ================================================================== */

const MEDIA = {
  V01: null, // hero — onboard iRacing, loop 8-12s, senza audio
  V02: null, // come funziona, passo 1 — schermata di ricerca coach
  V03: null, // come funziona, passo 2 — sessione live vista dal coach
  V04: null, // come funziona, passo 3 — curva iRating che sale
  I01: null, // ritratto/setup postazione di un coach
  V05: null, // chiusura — montaggio gare, loop lungo
};

// badge "Funziona su iRacing": MODALITA_BADGE vive più sotto, subito sopra
// BadgeIRacing (deve venire dopo anyOf — vedi il commento lì). Qui resta
// solo l'asset che quella variabile sceglie se mostrare o no.
// PNG/WEBP fornito: silhouette bianca su trasparente, 640×490, senza
// wordmark. Incorporato come data URI — stesso file sorgente, un solo
// costante da sostituire, funziona identico nell'app Vite e nell'artifact
// HTML statico (nessun asset esterno da servire in nessuno dei due). Se in
// futuro arriva una versione SVG basta cambiare questo valore (anche con
// un "data:image/svg+xml,..."): BadgeIRacing non va toccato, il tag <img>
// e il suo CSS restano gli stessi per qualunque formato raster o vettoriale.
const LOGO_IRACING_DATAURI = "data:image/webp;base64,UklGRtgeAABXRUJQVlA4TMseAAAvf0J6EP8nFkzmLx1C7/zP/wQkdJznKGjbRkr4095/ByAiJgDp64ATzjIiQAfskwoZ3zTs8IRZWW/Yth2SpG3bHpGZ5WoV2rZtc2zbtm1X27ZtjG1P23Z32Zlxxu9BxHHsMRci+j8B/rDtX+S0/7/Hc2YlGyfESQINFiS4O3VFW9zd6kqBGtCWFmlxqxsuBV5Yi7trKA1QQiAQ992szPPxR8Mmmedjnhzk9ZaI/k+AG7zd4QsAYBqy99KlY29XgaCOz5e7+zVt3GbJhtCgzoADvZNv3tr/6OIvAzr+W3t2dLzRJ+PzhOsBnZiT1To43hh0Z5LtaEAn7mR4B8e9kl0hPn8GdIL3PNrSPu331BZR1wM67M3NDYrGdEhf/8GqgA74r/+tX7Ta/NvT1YM6EPjZ/o3r9iyrDYEdMMW1aVfbCpV47v+fmjRPJUpNd+ZP/5e27603K0+u1dtDff7sgQWIiBl1oPLkGL31xp/9iudf2rLKO5uw1KK6lXZulIYrLZV0FPd9cttU0qmC9//JVjmnuhcFXSvn1PMC1/pXyqnhjfOZSjks1QvcWaUyDvzAvSjsUylnqMsLPBhcGadOrjfFQyrj+Bz1Bo+FVsKBL7xyjqmM083hDV4KDuDE3vDK804AR93qFd5JC97A2x6v8L1w8KZTtndn2gZvQi55575nB27ghzL8khG8GeHyrqhr8OaJIu/ce4I3zXPKMCMSuIm/XoafMgM3gXvLUNwrgMB8LaSps8rgjo8LGpg7/HTu+NuRhMGznjIc6R4wsIxNRUT37gTC4pLLYNakBApM43Kx1J/96bKtKYNbeEOQgHXLwtILmtEFb5fF/a5KgOCRq3j/0YQ9ppUl+qwVGFA2cy8+IqxRXlncIy2CAsogDb18gyolKrF3bpnMMjsgUOMaeslfIInFjNv2181srUxu9GorEGCdz725W4civwEXnFjO2+oFArpko7cb/QmKXOjA8p+UGAAI3oLeuvsDPdV/51iBRVfb9GN9nF4dD6cnZjtW7PYG9Avaid66BzNyqm7hFeTOS2Hfi8Ve7bABNX7fubGii+4ln8929Lo9UKN+VIIVv7ct957I8SrDTM7gPNShWVOReeZfuTf8VyCGNbyHuix5wiZei3T01j2Mmoj9qNNjnXmnzOdeZcUTY5vP9WK+SKDdI2no9R9mWtgAO+r3EZt1Uz1e8beBloYpqOPsTqTzzUCvs1vS4vcL6npTZcqx8ej9cX9ans/TV/kjIcaFnPWOzwJS2CrU+f42hGODPd4VPEuL73m9uTNT+BZ6EL2/GkWL5bju8q6gGxvoKsMaRgvM0vTmfp3GtrAD6L1rLBDTOl13ZQ+RTRnpLkNWS2qsv+rO3VWbay1vYRlPhlIDz7l1FxuTzLSqe7CsK83kRJ3XnVu2rBbP1BmuMo0Hckxf6c91f+wXYtmTmVhWdxt64AWPAO6hO5M4FnYEy5waT1DNOyK4RcOqU+wTd9mOhRIUdEQIN7aptcWv+gVY9o1+BJl+EcN19/Sjl88GLMezE7tUVRkx8Jko7v6W7HrRVR6IWuGByfEKLWOFMb9mcCvsGJa7lrOoNqPkOWFcd0lFZrFx7vJD1K48qxLSqsSrfKeuosOTiBV9Giv25lOExGV79d0JXblFD0dopYz3VBAei6TD76w3jkc/1pd75nKbVW3+wop2TqRDnefNnpAWBfpy9/YkVfwxXmG420wGNPXczz2IBe3Smft9XUoFbNCw4m/E0gHzPPfZHAAwQW9mTUVCqZ95UIc5zQjxW1xSyuUEAKidqjM3OiLCpx6FqMe8NoSA35DjbnQfbsgAwPKj3tzCu+kUcQP10Y4SYJFPjnwyFEp9zqU3N+eJilyyLkd9er4PoMT7Khd155YuamETiXUr0gk655qJUj7Sn2u2XJrAo8ijqFv3iHE0QW2X/lw39510Fqmva/rB/a8RBXtEcGMftLI4FJ+MOj70EVVDXSIgpg1UHgap01FX06mKvCUGuuaGPgSqnSwFynJB0PNHM/bQ5223FMCTeYIgT+6uPOQJPoVy4DPfJQjixToPeZ7NlwQI36aJ4llgebgzn8sC1D8pCub2Zg9zgs6iNLCWf4mCl+If5jTP0tsUwgAaXxQF11gf4gx06+1V0liNNW5BnOMf4nyIMgHg2/vnvduW/nQwV2+Y+eefO5cPDnsg8anWqHOvYRPf/6jUtyYM7vlo05pVTQ8QiyUDwBrkr1hCGi/J11mpjsNd2QOFObR5v483nkq+l2t3o5cue15GyuVja75bOXvaxL6dE6pamNz575eO+1qHpguA/Ea7BwYW0nTsz+fSHVjBHkde6vnfZw1oEmGRtzdKdPeWUYD6erEAyC+FPxCwKm2mHczWUL+enNPfD2sYzKSsdjbq7hPDgIBdIiB+Y5M/S53X9xWggFl7P24frEqX72rU33TjgD52IUp6y565/co0jqIWn5je1MTkqo9TaiLPCoEXY6XO+vweJ4rtOjg+iklUQjJKjTpPDP65Rd78eh9wofjavSUdrFJkNbO6B1FuoJsYmNlB1pROm4uQRp67pae/9MTOP3Jg+UUuwgFDeUoQ3BYmZ3Ff3ONIZ+HBASFMamoeQ1HLR08zkndEKZkdzuTL2vuUG2m17+9bRWLYO1yU8jHm9w3E/K0o6Nr/nEWyWI2vipBe+7ZnfaUlaC8KGltaCYzEd6swiPkz/KXKp8dZjiQX/tjUJClPFQtiPq0NY9kuEPJVkfLEIr8qQrLvTQ9kMhK4GQXd0hzeYv1NJMQjCbKkPH2RI+UXnjFJyLNOQfZ1h8fAYI9Q+PeTqhSFf1WIxNuXVZcO668o5vHBludUWSsW3n07QH7ULqc8SL52tqdJHoK6zf5twavXxMi9LgzPgVr7xULHf5pLDov6NBMNMestJglKuz+KEdGtCVH6WBw8iNU9JBbykzWkxvbsITca5NVYOVCeuobiOsOS4EUAda5yoVDbEykvLP7rbDRM1wg5aP0XiuusT4FHQcd0sRB31WaSEjTyMkcD3W2RgdA/UeDf68Oz2ExNMDzbXpERpdleFxpqfqIEsMkugbLPg3dBzFXRMHucVT5Mg3PQYLWpElAnBcV1zlCMDN51i4bOH6JkwzypGA33HDM8NpuLY5/lA4YWd0U49BxoIhfKgBw0Xq2m4cXeQmFTxviCsbG3nMIhv9xJKjrfRCN+mRnda25R8r5vooLBQcxR8RBvNGDyEHOIG9JGi8GpZ1BInrOpix+U1YtYr3wC8ECcNFjmu9GQb4UZXGNNBJ656kkblN2LwPpWIQF8bxNFEnrkozE7OxqbOh31z3O+7WSG8vQksIwvEg/x6uOKFISeRaN+3chY4KCb+nNt6WSG8vUmUIe6CMDMEYoMzPQY1s8mw2IRbyRpqPv0gRYob48CNrqYACz8wMf4EorRsE9UMaqID9I01L32Z10GkgHmT10EoH1+kNFZf0Pjvh1vUIlH3ah/bUsMVKBnQfB6jQB0rgoxuGftBlbSxpiC/uQoYGpDkBFIuEAB8o3VmZGF7EYj72NI4as8KOK9JnICvbIoQL67HjMuNshpaG8bkd9CDYUseFZSLJ94KEA80UIxrMjjaOhfMeNRR9hRzOJekgIRe2nApK7MoNh4zdh+thpPy1soaFF3WYHWGTRgWg9mTHEX0Ni3+htOvZMoanZ7aVFe9dCAuRPNhjTVbXB7g43Fp81b11DY5GhpgcDficDCmRYDqpWMBn8y1EhY4x35HhR3gyIvUDeLCHQtDTEcZYbb6M5FGAh77DqK7BgIEgOvOIhAzwyz0dT7B43+rxgDSbyMQh+Nkhq/DZwITG9rMMoczfCuGkjwGhTaPoBJDTRIpgLXBxpLg3R8cFKGOYXiK/1BbmBYIRUlvZiRsG/5A1T8BRSZH44F2TEt0YjAIxFGkuhG478QaRTKQk2ok/EgPRC9nwr3ewZi24wSeCrUKHrnocDuLWEgQaxNChF4vb5xdHfIwJEQg2hyBQW+9U4QyBCoA/OJ0H7wMYrwQyiDe4MNIWhyMhdoR0MV5Aisw27RgIUjmTGYXndLwcUoI4jf5EaR99hAlkBpfVojAW93NYbEGyiFWQkGELeLo9AZreUJIG6VkwRM7WgyAJ+VWI68VIPR2tEX9AMK7pkoUxAwo5AEzPowzqwqjLYWd++juUrs6VdP7Nny83dfz549e/aC71dvO5KUbne6NUPAAeSpk1yi4VypAnV4OgnIs/9YvuC92gplc3gp2rF3n2gYEWAzK+C1yRYQ0+qld1cey3HT9x55zW6h8JP9FSidr5JQKi/Z+LiVrJhkRER+vJsPg/JniurXZMSi4zmctK9V4nzWc/GyfBawZifJQOQFG9qqRA13IGLJpxEMKpypAQn9vznvoOtXK3Ev5qPw5bf5LWAJe+lAxNS3A0gybULEzBFm0KspstPMI4Wcph2+lClxbY+g+Eda+i6A2MMaIWhfEU5RrVuI6YNU0LMa1nHWOTtFRwPoUhMXXsv2iGcWhH0Y1DrECUH3zyEEvVSCRa+ooHc1vM+6Oxo5Z0PJsg5M5kjhsd7wY1D/DCcEPYtUer5EvsoGIpoaz7jkJOZiJFXWCQVIYvSliD+DdjcpQc9LjBplJ+Z2BkFZ5KijTlL+rk4UG5OHJJrVafBp0CePErwRS43vOTwXJgoA2J7f5ybkejxRXdKRxh/rwbeZpngowTkmYvwv4d81BAIwP/kfu+REnUYaf24E/wah20lJrUuMeT+6FoSKBMz/+e0lMqPM8pBgfm5o+Tlol04Jn6zQAlM86Do5tXtTG8S/UEMIAAjue8hNQlI1khIzkMLY+gb468qJeSYnBI+GERO5KtteeHPtU1bomNRNFGARE5I9BFyIoMi8XKOgeEp1+DyI+5sSe1tiILDDS08n+AJA4OpWwgCw2l+nc+FOBNHDYj8tRgJPv5gK38e6OQjBgdR4aZ4aJxCA2mmbXbQ//MixvnAaCTQ7Lo/A/wGb5SZkEFmm8b5CAQSMuqaJtcaHmqoz85HA2PutLUgAAnZKkGUYiM6iZ+ULNV8lJn6nBwmMvlkBf3VpgbpX5cfWQzgApeaPBQK9A7S2uowEmt0XWBAD65MnPcFPEwBg7biuUJietLT4m1OwuZkFOYB5llt2YrqQAOD/xJoCMexNSIlJ4kjhVPwdJQaitstOg5ZEAAR0/eG2JsC1OEqC1iGJZXcIA1qlSE6XumQAWBt9cjaP621XECHqyy4aDjaVhjrKQcNkH6p6RRMCAMFPfHYgrcjDOdeKM1y6+FolJOEfJNHMtKUBft9xEvIXVGM0jfKnBQCsNR8b+s7k90Y/lbhbFwOATvNspPFUL4gDYpJIQH51qJki60iVHG8n6SGnISH17hIxNV4grFMJCYie409a6an5OBA+TA8HA+lQpyONh1pAIMA+99CAWLS+q5maNjUJU+frYRYjggXXf+EKDdHHQiKBkD1UIGZ911KlpVUoYfVu6sDZFSg01R256nxaAadhYxpkAu1ukYFa6qfVGSVvtqAr+Eeug79CCPB79McUJ5J5ojOkorxhJwPRc6qXhQ62eXMsVYEfO1GHc1Xh1MY/ZHOkM/ZgSCzgv1ajA9Ex59GGYRYa/E55tjdSSQqb70Ad8lYgus/om0ipszwCuUDDK5QgarmXfxsWrYqn9MxCnjIlWiFHbbbLjXq8oIhmm+dAUjfXg2TYSw5S/q2lfREh3Kg8RER+54sWZloCZmahLrX3QXCfpRxJPTMIogHrHE4NIr87xiaU0tuD9/X8tbh/bX8i1NrTbnPUZ3ErwSwzNSS16H4IB6IO0IPoWBYuUvM09Ja7cs6vm9K/fa2qJoEsAeH1h66+50G9Xg0Si/UuRFKj4xLEA23vEYSeVZHiBGzEcnTmpl4+tO7r98f1e65T83rxMaHBfia1HG3BwaExsbUTElu0feyZ3v1HTnpz+pwVq7YcOH72SpoLdfw9Eyv2DNK6tjrko451E4SuFX7CPG0vj/t7HIW5Gbf/SU66eO7kyRO7tnt7+OTJk2cvXkxKvpaSejczO6+g2OHSUEzXUBA67EuNlt9aQkBg+VUjCIsnKYJYv0Wjv9dQJLXV1hIk9dhgS0RQ7ThF+E8DQWKvGt5hm0C2MalIa+FtNmQEbW9RxJepYrR0GR3/DMQNXOpAWp034iAlNiifIMyuJ0YfNPrCF8SJ3YnEmpURiAnYuw6CtC/FeMXwrkWLwlpeRmq/SIegwH+uhx68rgrxmuFtYIKwTleQ2h1tISqo+r1GD28uxASjc78Mgnb9G6k9foElLIhcrZGDbzIRehtdZitB2l7m1OQ/FIK0IHYLJ2e1WYTWHoM7WlWMOsc4EhsbkQx5QcgmNzXn/USITzW4eaoQwVs5EmvWZkBiEPK9i5iMCBGC9xib1g1EZLM8SO2WZpAZ+M5y0FJYXwT2obHdekQE1tWF1MauhNRAGZ5GirsHEwCa5BnaBj8Rwi8guWfryA3Ux+5Qgv90UwUI3Gdor4OA6hROz09JggPTWDslmD7Gqj/2kZEVtRah1g2kd2RIcuD7qYsSzP04UHfQ0WlgZ8IE8JvB6TH9IToIXKZRgvbFYboLTTGwn1T9xc0vRHr3xQsPfH90UYKejdX1ZtliYMtA7yxxj4b0xl6C9CDwVw8lyE/UZvpSZsoTa3WBI8FH68sPqm7hlCAmt9EXGyxPTZKRYucVSwEg6ggtmDWgSkS1R6KrWvQBHaUpIQ1J/jkTGgCd79CCBdfS8wvybh6a/bi/HurKUo0TSHLOZdAB80fEeJm/p5e14sIlKWQDJyk6Ik4JoPZ1ohDzVlSrsFA5ss10I8VmfQ1ogWUlWeg58AiroAgDW6oj5aV8JHlrO6gBDKML8VgtYP51Hh87ZcqUid2ahKtlSjAuz1gdJSYhyUcGW4rQ3k0Y7mzzzh/3NPw3L7g0t6apDJ2M60qofvzWcpJyrrKhCLXTKON2jl5nLqrLvBpgXCtM+pngQIqdm21ogt9uysqxeGUz9X7KTOOaquimyR2kuPBu/PP6O3iDewlqmSuaslJ8HtlhXN+a9OK7hZP0XYI21Er3FESetqjFEyNnrDp+w6kZ1j9RehlbgiRvtLTBvMhjEHlGvgsR8d4Rw9JmWvURl4Y0T4Q2QJ08r7kv/+FDjT77vQxneWDO8EhfVnE+K5Dm2N36AFkxb3KPal5Amyf71PJZO+5i+RafXzfzxcbhVuaFOazBY8PfmTJl8pinG4WaAYB1txN1vJVCVNvsTfZ2lu10eezJv4xt+8QPmViRPP/yxo+er+lrYsxaZ+zPF7I1LJXnXvhhcIwp+iTSbBZEFAJXF3pSYQ14oYio3C1vtQ42dVlvRx1qeWe/GTNsey7HMvI7y1Zyoo53hkaERsa8KD8SLL9wclxp2ye3twBUGXCEo5Tm3waVQLXPvaioHkC9JFI8N7ZOezTSqgCr/tq5EpTTs/fHKwV67PMg53MA0O0OFa7kzdMei7MBAKiJXya7UU7Nz+dHoBWh63K9R/sCAEwv3hHPnXth1Zsd4/wYAAALevKnOxzl1Dn0cm0LaoGEl8o8B2/YAMDU7QoXiBfdPrV8bNtIK4NS1ZjhO/I4ymnZzvdahfCPLQKkTnU8B8crAAD115aI4cpK2vxBjwQbeGlr8VmSByU1//P7a+OfXAbIWO89qU0YAIB10GmnvjRXYfL2zwc0DWXgrRred3M+SqrJnjckBf/sQkDmH56DJx75F0Bgvz+dunFdXj2tR0KQCmVUWs657kFZLZvbMoR/eimg0e+eg+ebs38BsPhXt6a5K8SVl3Lwh6l9Em1QjpZGUy9qKK3O193ggWJAp62ew1PG+ZcCwKzhnV9euvN8Sk6JN47ctGtn9qxa8HbfDjWDbCYFytG32Zt7CzSU17LpVS1NsXru9hpE+7YnraWUqviFVm/YqlO3XqU+1bFlYq3oEH8zlHtI148PZmootV9mwhPlAHvITs9BnrOjd5R6Hz2rQYkDv72Uq6HsTgwrC+whez0HEe1nvuga46Mna3iDPnP2pzlRhu+CtsAetM+DENF55bfXO9cIMleY4hfR8Nl3fzmdy1GSC9rpC6wBhzzp3+5bR36bPvyxxtUCfH0sJlVVlVJVVTVbbf5hdTr0fW/Frss5Gsr0t+kKA6tHjleVrhVnpZzbt+XXb+fN/uL9yZMnfzh79narth+7mpHvQgnPCmkM0GaXpz1YFnSFzlhdNhsl+iBVaWC1+9GoUOxmaA3Q5hOjQb+mKQ6afeToj7nT1hzUWeeozx9JUB1UXeooT9FlUB6kLnZ0Z0lEfZA4oVxz9jWF/iB5RKneFN5paRBS3ivSGmd6IlQIKS8WKc0X9aBESHm1SGUO9bLUCIlPFipM3o0h6BEiDxepS9mzcdAkWPcUacvYBOgScPkpVXEW2lAn+4IDiuIsqQR9gj1gi5rEVtWARsHu9J3RkfJlNaFTsFp85GhIdE4NaBVQa6mjH2WT06FYSJ1Rph2lWRWgWkh8q0Q3Yo/GQ7lg3XFaM05eBe+WE+zzd6qF2dzH1jDYHb82OhHb0MKCisFqsCiqEYWjqsPTRQWkZRXrw7EHUqBoCD90Qht+HmhD1WCdu91oQumSmvB8cQFNP3L0IP/pRCgcKmaVaIEz2oLKIeGmI0qwoyGUDqGuX6tA8b2W2sGqOqNIARZVgt4ByQ8dNtLb1RaqB7v31zHZFVxvKx9Qc0yh5GLvxEP9EHf9EcGtqgACAPVXOkIz31cEBxD/5AmRmR8agwUI9fgoKi/zbQvwAMh87YS0nC9bggqIG/R5uahia5uBDEDVN08LqnR6dfABod7fR6WU83wKGAFUejVXRsfOC4EUQI+jAoquqAv/qQjWfPkceSQZzMCVxcKJrukaAjdq/SEac+CRNPhTTQiPkkzJ8o5h0AP9SsXi7LovEb5VFTK+k0r+jCbwsapgvykTs/mKCEiCLgUSyX+nCvytLlT8UiBf9QmDKNaz8vgx3QJT0K5AHJ/B/ypD8lfi+IQt9rPiWMIWNHWEYYbRBb8JI3YvX15wZFHShy/t8mVxujpfEr+XxbfxfMFrRhQTQZjeuZKI3cGYSj9LIqcbYzDcCGJHJmUuyBfEWosy6dvlYF4EZTBdDgUXk+aaEjEcbkqaRnvF8FMCaRKXiWEGSIP7pBC9nzats4WQ24s2VT4Xwo7atLHfFMKqRNpgQJkMXrJ4U32bCJzB4E1krggONyAObjcS+Kgic5rlSiDLZk7StwIwl4M5ofcEcKoZdTBQAF9U4E5Sof8baXEH7/s+5wqQ55mY38tuwJ6exX7v2yT2VN7r90aG2GMv9XuXgT14wPF30Sr86Zbj734Ef9K2+DrnXQJZC31d2YUEwgNRP3e8OoN6nvFzm8IMStvm48zzYBCW+rj8ARx63SNvO6txqHO+vC0Gh2KuSFv5vSSybZK2U51JxKZK28/JJIInNEkz48CiWmmSVnIVjarsk7QDTWikLpK0Dck0guGS9qzFo+ZFUlbaHTyKviplv1cnkm2LlE2PIxL7VMbMzSASvMgl7HQLKtUvlLDPKlApMFnC3rWoZNkkX9FBoJIyXb4OZ3IJesvX8jgy1ZSv+y0yqTmyZZqCTHBAtvbZdFrE5cpMBp3Ge+Sq/Do+dXbI1dl6fIrJlqtPI3zyuyBXr4FPbJNUFQ4hFMyUqj01GTXUI1OrbUZ1KZCo2ONgVK07EnW2D6WCzkvUtsqUgu0SNRecmi9P5XeR6hVNmk52JFWPImn6Lo1UrTKlaVKYVHE3pOkmkMrnvCxlt2QV/EeWvkqj1UJZmhCm1dtckm4ErfqXyFF2a151LpSjn6rwquFdOZoR5lXMFTm6C7wKOiZFxR2IZdssRfsqEcu0XIqWRYjFpkvR0zaxYLwU9QazeshQaQq12mgS9DOo1aBAfswEbsWnyk/0Dm5FJ8lPUUduVT0qPwcqcytwh/x8GOKWbbX8ZIFbpuXSE72JXDBberK7sGuK9Oyqxq4J0vNpmF0DpWcs2PW87ETvplcn2ckdRK9WJZJzsBG9mhZKzq9J9KqfJTnLQa+EDLkxr/Orxi25KbuJX9VT5Ca/F7+ikuVmfyN+hSbJzQ9Vgj7LE4I+w21+hZyVm/vBr6CjcjMk6FPYOuizv17Q59u0oM/KZIJVPS81E0MEC02SmucR9LmeYWFS4/RlWLXrMpPblmHVU2TmcH2G1bwtM5vTGFYvQ2Y+S2VYozyZWRbHsBZ2mZlsMawDl5k3wLBnUGbvp1h/qbmSYhNlxhlAsQ9lprgDw9jXMpPXmGE+v8rM6UyGRZyRmUOpDGtaKDPfJzJsNMrsOyGCmb+TGUcjECzsjMTw78CwllkSY29DsZEuiUkLpdgylNjbIQyznZKZ/BoMq39bZkqeZljvYpnRpjNsOpcZPEYwdSdKrTudX9HX5Aav4Vf7PMkZHqLXOE1y3o+n1zcouQcrs8t2SnaK2rGreo7smOuk1deW9vNO2XGH2X5/it6mPC/trVx6Nr/0vM/fpbcA7P/77//++xfCtuDtClsZAAA=";

/* ------------------------------- dati demo ------------------------------- */

const FASCE = [
  { k: "b1", l: "Sotto 1.5k" },
  { k: "b2", l: "1.5k – 2.5k" },
  { k: "b3", l: "2.5k – 4k" },
  { k: "b4", l: "Sopra 4k" },
];

// punto medio di ogni fascia: usato come iRating di riferimento del
// pilota quando non inserisce il proprio valore esatto
const FASCE_MEDIO = { b1: 1000, b2: 2000, b3: 3250, b4: 5000 };

// come si racconta ogni fascia in una frase, per i messaggi di forbice e
// per il confronto dichiarazione/dati sul profilo del coach
const FASCE_FRASE = {
  b1: "sotto 1.500 iR",
  b2: "tra 1.500 e 2.500 iR",
  b3: "tra 2.500 e 4.000 iR",
  b4: "sopra 4.000 iR",
};

const COACHES = [
  {
    id: 1, nome: "Marco Bertolini", cat: ["coperte"], tag: "vela", lic: "A", ir: 4820, prezzo: 45, fasciaDichiarata: "b2",
    auto: ["Ferrari 296 GT3", "Lamborghini Huracán GT3 EVO"], spec: ["Trail braking", "Qualifica"],
    obiettivi: ["frenata", "qualifica"], irMed: 412, gg: 30, tracciati: 14, agg: "6 ore fa",
    fasce: { b1: [520, 26, 4], b2: [470, 28, 6], b3: [210, 34, 3], b4: null },
    curva: [1980, 1972, 1990, 1966, 1974, 1985, 2040, 2120, 2185, 2240, 2318, 2372, 2396], start: 5,
    patto: null,
    bio: "Ex pilota kart, dieci anni su iRacing. Lavoro quasi solo sul punto di staccata: nella maggior parte dei casi il tempo che manca è lì, non nel setup.",
    metodo: ["Sessione 0: giro tuo, senza correzioni.", "Confronto telemetria curva per curva.",
      "Due curve alla volta, mai di più.", "Compito scritto tra una lezione e l'altra."],
    offerte: [{ ore: 4, prezzo: 170 }, { ore: 8, prezzo: 320 }, { ore: 12, prezzo: 450 }],
    fuso: "Europe/Rome", fasceOrarie: ["Feriali sera", "Weekend giorno", "Weekend sera"],
    slots: ["Gio 28 · 20:30", "Ven 29 · 21:00", "Sab 30 · 18:00", "Dom 31 · 20:00"],
    rec: [{ chi: "L. Moretti", auto: "Huracán GT3 · Monza", ir: 564, gg: 22,
      txt: "Mi ha smontato la staccata della prima variante e ricostruita in due sessioni." }],
  },
  {
    id: 2, nome: "Elena Kovač", cat: ["coperte"], tag: "kovi", lic: "A", ir: 5610, prezzo: 60, fasciaDichiarata: "b3",
    auto: ["Porsche 911 GT3 R (992)", "BMW M4 GT3 EVO"], spec: ["Race craft", "Traffico"],
    obiettivi: ["attacco_difesa", "passo_gara"], irMed: 508, gg: 34, tracciati: 11, agg: "2 ore fa",
    fasce: { b1: null, b2: [430, 30, 4], b3: [560, 32, 5], b4: [190, 44, 3] },
    curva: [3120, 3098, 3140, 3105, 3132, 3260, 3348, 3410, 3502, 3560, 3618, 3690, 3712], start: 4,
    patto: null,
    bio: "Il giro secco lo trovi da sola con la telemetria. Quello che non trovi da sola è cosa fare quando hai tre macchine attorno al giro 12.",
    metodo: ["Analisi delle tue ultime cinque gare.", "Doppiaggi e difesa pulita.",
      "In gara insieme, io in macchina con te.", "Debrief a caldo dopo la bandiera."],
    offerte: [{ ore: 4, prezzo: 225 }, { ore: 8, prezzo: 420 }, { ore: 12, prezzo: 600 }],
    fuso: "Europe/Rome", fasceOrarie: ["Feriali pomeriggio", "Feriali sera", "Weekend sera"],
    slots: ["Gio 28 · 16:00", "Sab 30 · 15:30", "Dom 31 · 17:00"],
    rec: [{ chi: "A. Rinaldi", auto: "M4 GT3 · Nürburgring", ir: 612, gg: 28,
      txt: "Ho smesso di buttare via gare al primo giro. Sembra poco, vale mezzo campionato." }],
  },
  {
    id: 3, nome: "Davide Sanna", cat: ["coperte"], tag: "sanna_dvd", lic: "B", ir: 3240, prezzo: 35, fasciaDichiarata: "b1",
    auto: ["Lamborghini Huracán GT3 EVO", "Audi R8 LMS EVO II GT3"], spec: ["Setup", "Gomme"],
    obiettivi: ["setup", "gomme"], irMed: 260, gg: 28, tracciati: 22, agg: "1 giorno fa",
    fasce: { b1: [340, 24, 9], b2: [250, 30, 10], b3: [120, 38, 3], b4: null },
    curva: [1640, 1652, 1630, 1648, 1690, 1742, 1780, 1812, 1868, 1890, 1922, 1948, 1960], start: 3,
    patto: { ir: 200, gg: 60 },
    bio: "Faccio setup da otto anni. Non ti vendo il mio file: ti insegno a leggere le pressioni a caldo.",
    metodo: ["Partiamo dal tuo feedback, non dai numeri.", "Una modifica per volta, con run di controllo.",
      "Foglio di lavoro pista per pista.", "Alla fine il setup lo sai rifare senza di me."],
    offerte: [{ ore: 4, prezzo: 130 }, { ore: 8, prezzo: 250 }, { ore: 12, prezzo: 360 }],
    fuso: "Europe/Rome", fasceOrarie: ["Feriali sera", "Weekend sera"],
    slots: ["Ven 29 · 21:30", "Sab 30 · 22:00", "Lun 1 · 21:00"],
    rec: [{ chi: "F. Curci", auto: "Huracán GT3 · Monza", ir: 284, gg: 31,
      txt: "Due sessioni e ho capito che il problema era il differenziale, non il posteriore." }],
  },
  {
    id: 4, nome: "Giulia Ferraro", cat: ["coperte"], tag: "giu_f", lic: "B", ir: 2880, prezzo: 25, fasciaDichiarata: "b1",
    auto: ["Ferrari 296 GT3"], spec: ["Fondamentali", "Licenza D"],
    obiettivi: ["traiettorie", "frenata"], irMed: 640, gg: 26, tracciati: 19, agg: "4 ore fa",
    fasce: { b1: [720, 22, 12], b2: [540, 28, 6], b3: null, b4: null },
    curva: [1180, 1164, 1192, 1150, 1210, 1298, 1372, 1450, 1524, 1608, 1690, 1748, 1802], start: 4,
    patto: { ir: 300, gg: 60 },
    bio: "Lavoro con chi ha appena comprato la GT3 e non capisce perché va fuori a ogni curva.",
    metodo: ["Prima le basi: sguardo, riferimenti, rilascio del freno.", "Niente dati finché il giro non è pulito.",
      "Obiettivo: chiudere gare intere senza incidenti.", "Poi, e solo poi, cerchiamo il tempo."],
    offerte: [{ ore: 4, prezzo: 95 }, { ore: 8, prezzo: 180 }, { ore: 12, prezzo: 264 }],
    fuso: "Europe/Rome", fasceOrarie: ["Weekend giorno", "Weekend sera"],
    slots: ["Sab 30 · 10:30", "Sab 30 · 12:00", "Dom 31 · 11:00"],
    rec: [{ chi: "M. Loprete", auto: "296 GT3 · Watkins Glen", ir: 806, gg: 24,
      txt: "Ero fermo in D da sei mesi. In cinque settimane sono passato in C." }],
  },
  {
    id: 5, nome: "Tom Reeves", cat: ["coperte"], tag: "reeves", lic: "A", ir: 6110, prezzo: 70, fasciaDichiarata: "b4",
    auto: ["Acura ARX-06 GTP", "Mercedes-AMG GT3 2020", "BMW M4 GT3 EVO"], spec: ["Endurance", "Ritmo di stint"],
    obiettivi: ["passo_gara", "strategia"], irMed: 300, gg: 40, tracciati: 9, agg: "8 ore fa",
    fasce: { b1: null, b2: null, b3: [380, 36, 5], b4: [240, 42, 3] },
    curva: [3980, 3962, 3990, 4010, 4055, 4098, 4140, 4188, 4210, 4262, 4290, 4318, 4340], start: 3,
    patto: null,
    bio: "Nelle endurance non vince chi è più veloce, vince chi consegna trenta giri uguali.",
    metodo: ["Simulazione di stint completo.", "Deviazione tra i giri, non il giro migliore.",
      "Procedure pit e cambi guida.", "Piano gara scritto per il tuo evento."],
    offerte: [{ ore: 4, prezzo: 265 }, { ore: 8, prezzo: 500 }, { ore: 12, prezzo: 720 }],
    fuso: "America/New_York", fasceOrarie: ["Weekend giorno", "Weekend sera"],
    slots: ["Sab 30 · 20:00", "Dom 31 · 19:00"],
    rec: [{ chi: "Team Aversa", auto: "AMG GT3 · Sebring 12h", ir: 226, gg: 44,
      txt: "Ci ha riscritto le procedure di pit. Finita la 12h senza un danno." }],
  },
  {
    id: 6, nome: "Niko Aaltonen", cat: ["coperte"], tag: "aalto", lic: "A", ir: 7020, prezzo: 85, fasciaDichiarata: "b4",
    auto: ["Porsche 911 GT3 R (992)", "Mercedes-AMG GT3 2020"], spec: ["Qualifica", "Trail braking"],
    obiettivi: ["qualifica", "frenata"], irMed: 210, gg: 35, tracciati: 6, agg: "3 giorni fa",
    fasce: { b1: null, b2: null, b3: [180, 38, 3], b4: [260, 32, 4] },
    curva: [4820, 4796, 4840, 4812, 4858, 4902, 4940, 4988, 5010, 5044, 5062, 5090, 5110], start: 4,
    patto: null,
    bio: "Prendo solo piloti già sotto il secondo dal riferimento. Se sei più lontano, ti faccio perdere tempo e soldi.",
    metodo: ["Solo giro secco.", "Confronto sui canali freno e sterzo.",
      "Tre curve chiave per pista.", "Sessione singola, torni quando serve."],
    offerte: [{ ore: 4, prezzo: 320 }, { ore: 8, prezzo: 600 }, { ore: 12, prezzo: 860 }],
    fuso: "Europe/London", fasceOrarie: ["Feriali sera", "Weekend sera"],
    slots: ["Ven 29 · 19:00", "Dom 31 · 18:30"],
    rec: [{ chi: "R. Halme", auto: "911 GT3 R · Road Atlanta", ir: 188, gg: 30,
      txt: "Tre curve, una sessione, quattro decimi. Caro, ma sa dove guardare." }],
  },
  {
    id: 7, nome: "Andrea Pili", cat: ["scoperte"], tag: "pili_a", lic: "A", ir: 4180, prezzo: 40, fasciaDichiarata: "b1",
    auto: ["Dallara F3", "Super Formula Lights", "Ray FF1600"], spec: ["Monoposto", "Staccata"],
    obiettivi: ["frenata", "traiettorie"], irMed: 380, gg: 32, tracciati: 8, agg: "1 giorno fa",
    fasce: { b1: [430, 28, 3], b2: [400, 32, 4], b3: null, b4: null },
    curva: [2260, 2242, 2274, 2250, 2288, 2340, 2402, 2456, 2510, 2548, 2596, 2632, 2660], start: 4,
    patto: null,
    bio: "In monoposto non puoi nasconderti dietro il setup. O gestisci il rilascio del freno o giri lento, punto.",
    metodo: ["Partiamo dalla Ray, sempre, anche se corri in F3.", "Un solo canale alla volta: prima il freno.",
      "Niente aero finché il piede non è pulito.", "Test settimanale sulla stessa pista, per misurare."],
    offerte: [{ ore: 4, prezzo: 150 }, { ore: 8, prezzo: 290 }, { ore: 12, prezzo: 420 }],
    fuso: "Europe/Rome", fasceOrarie: ["Feriali pomeriggio", "Weekend giorno"],
    slots: ["Ven 29 · 19:30", "Sab 30 · 17:00", "Dom 31 · 21:30"],
    rec: [{ chi: "G. Petrosino", auto: "Dallara F3 · Silverstone", ir: 402, gg: 29,
      txt: "Venivo dalle GT e frenavo come un camion. Mi ha rifatto il piede da zero." }],
  },
];

/* ---------------------- "Il mio percorso" — dati pilota (mock) ----------------------
   Tre fonti tenute separate, come da spec:
   - PERCORSO: dati CORDA (interni) — disponibili subito, nessuna API esterna.
   - CALENDARIO_STAGIONE: PLACEHOLDER del calendario ufficiale iRacing. Da sostituire
     con corda-vetture-2026s2.js / la schedule reale quando arriva — per ora piste e
     date sono inventate solo per popolare la selezione "gare che pensi di fare".
   - I riquadri "strato 2" (curva iRating, ultime gare, licenza/SR) non hanno dati
     mock qui apposta: restano nello stato "Collega il tuo account iRacing" finché
     l'integrazione vera non c'è.
   ------------------------------------------------------------------------------- */

const CALENDARIO_STAGIONE = [
  { id: "s1", data: "2026-09-06", pista: "Monza", auto: "Ferrari 296 GT3" },
  { id: "s2", data: "2026-09-13", pista: "Spa-Francorchamps", auto: "Porsche 911 GT3 R (992)" },
  { id: "s3", data: "2026-09-20", pista: "Silverstone", auto: "BMW M4 GT3 EVO" },
  { id: "s4", data: "2026-09-27", pista: "Watkins Glen", auto: "Lamborghini Huracán GT3 EVO" },
  { id: "s5", data: "2026-10-04", pista: "Road Atlanta", auto: "Ferrari 296 GT3" },
  { id: "s6", data: "2026-10-11", pista: "Nürburgring", auto: "Mercedes-AMG GT3 2020" },
  { id: "s7", data: "2026-10-18", pista: "Sebring", auto: "Audi R8 LMS EVO II GT3" },
  { id: "s8", data: "2026-10-25", pista: "Charlotte", auto: "Ferrari 296 GT3" },
];

// il pilota mostrato nella demo (header, "Pilota" nella stanza sessione, Scheda
// Pilota, ecc.). Tutto qui sotto arriva dall'account iRacing collegato: senza
// collegamento non c'è iR verificato, e il matching non puo' calcolarsi — non
// esiste piu' un valore autodichiarato da mostrare nel frattempo.
const PILOTA_DEMO = {
  nome: "L. Moretti", ir: 1842, licenza: "A 3.87", anniPiattaforma: 3,
};

const PERCORSO = {
  oreAcquistate: 20,
  oreResidue: 6,
  sessioniTotali: 12,
  coachAttualeId: 1, // Marco Bertolini
  dalCoachAttuale: "2026-08-02",
  sessioniConAttuale: 4,
  storicoCoach: [
    { coachId: 3, periodo: "mag – lug 2026", sessioni: 5, irGuadagnato: 180, auto: ["Lamborghini Huracán GT3 EVO"] },
    { coachId: 4, periodo: "mar – apr 2026", sessioni: 3, irGuadagnato: 90, auto: ["Ferrari 296 GT3"] },
  ],
  prenotazioni: [
    { id: "p1", data: "2026-09-05", coachId: 1, orario: "20:30" },
    { id: "p2", data: "2026-09-19", coachId: 1, orario: "21:00" },
  ],
  garePianificateIds: ["s1", "s3", "s5"],
  // origine: "coach" = consiglio scritto dal coach in sessione, "chat" = riga
  // di chat che il pilota si è segnato — restano distinguibili in lista (punto 4)
  note: [
    { id: "n1", coachId: 1, data: "2026-08-30", pista: "Monza", origine: "coach",
      testo: "Prima variante: stai ancora frenando dritta.", fatto: false },
    { id: "n2", coachId: 1, data: "2026-08-30", pista: "Monza", origine: "coach",
      testo: "Lesmo 1: entri lunga per compensare il sottosterzo.", fatto: false },
    { id: "n3", coachId: 1, data: "2026-08-23", pista: null, origine: "coach",
      testo: "Parabolica: qui vai bene, non toccare niente.", fatto: true },
  ],
};

/* --------------------------- chat coach ↔ pilota (mock) ---------------------------
   Un thread per relazione coach<->pilota, tenuto in CORDA — l'alternativa a spostare
   la logistica su Discord. Solo testo per ora: niente allegati/vocali/reazioni. */

const CHAT_THREADS = {
  1: [
    { id: "m1", da: "coach", testo: "Ciao! Tutto pronto per la sessione di sabato?", quando: "2026-08-29T18:20:00", letto: false },
    { id: "m2", da: "pilota", testo: "Sì, però possiamo spostarla a domenica sera?", quando: "2026-08-29T18:32:00", letto: true },
    { id: "m3", da: "coach", testo: "Va bene, domenica 20:00. Porta la Ferrari, lavoriamo ancora sulla prima variante di Monza.", quando: "2026-08-29T18:40:00", letto: false },
  ],
};

// quanti messaggi del coach non sono ancora stati letti — il badge "nuovo
// messaggio" richiesto dalla spec; chatLetti tiene i thread già aperti in sessione
// non letti = messaggi del coach oltre a quanti ne erano gia' arrivati l'ultima
// volta che il pilota ha aperto quel thread (snapshot, non un flag per
// messaggio): cosi' un nuovo messaggio dopo la chiusura torna a contare
function nonLettiDi(coachId, msgs, lettiSnapshot) {
  if (!coachId) return 0;
  const daCoach = (msgs[coachId] || []).filter((m) => m.da === "coach").length;
  return Math.max(0, daCoach - (lettiSnapshot[coachId] || 0));
}

// gancio per le push notification quando ci sara' l'app companion — oggi non fa
// nulla, va collegato quando esiste un client capace di riceverle (punto 1)
function inviaPushNotifica(coachId, testo) {}

const CATEGORIE = [
  { k: "tutte", l: "Tutte le categorie" },
  { k: "coperte", l: "Ruote coperte · GT, prototipi, turismo" },
  { k: "scoperte", l: "Ruote scoperte · Monoposto" },
];

// vetture per macro-categoria, raggruppate per tipologia: i gruppi diventano
// gli <optgroup> del filtro vettura
const AUTO_PER_CAT = {
  coperte: {
    "GT3": [
      "Ferrari 296 GT3", "Porsche 911 GT3 R (992)", "BMW M4 GT3 EVO",
      "Mercedes-AMG GT3 2020", "Audi R8 LMS EVO II GT3", "Lamborghini Huracán GT3 EVO",
      "Chevrolet Corvette Z06 GT3.R", "Ford Mustang GT3", "McLaren 720S GT3 EVO",
      "Acura NSX GT3 EVO 22", "Aston Martin Vantage GT3 EVO",
    ],
    "GT4": [
      "BMW M4 G82 GT4 Evo", "Ford Mustang GT4", "McLaren 570S GT4",
      "Mercedes-AMG GT4", "Aston Martin Vantage GT4", "Porsche 718 Cayman GT4 Clubsport MR",
    ],
    "GTP": [
      "Acura ARX-06 GTP", "BMW M Hybrid V8", "Cadillac V-Series.R GTP",
      "Ferrari 499P", "Porsche 963 GTP",
    ],
    "Prototipi": [
      "Dallara P217", "Ligier JS P320", "HPD ARX-01c", "Radical SR10",
    ],
    "GTE": [
      "BMW M8 GTE", "Chevrolet Corvette C8.R GTE", "Ferrari 488 GTE",
      "Ford GTE", "Porsche 911 RSR",
    ],
    "TCR": [
      "Audi RS3 LMS Gen2 TCR", "Honda Civic Type R TCR",
      "Hyundai Elantra N TCR", "Hyundai Veloster N TCR",
    ],
    "Cup e monomarca": [
      "BMW M2 CS Racing", "Ferrari 296 Challenge", "Global Mazda MX-5 Cup",
      "Porsche 911 Cup (992.2)", "Porsche Mission R", "Renault Clio",
      "SCCA Spec Racer Ford", "Toyota GR86", "Legends Ford '34 Coupe",
    ],
    "Turismo e stock": [
      "Cadillac CTS-V Racecar", "Kia Optima",
      "Stock Car Brasil Chevrolet Cruze", "Stock Car Brasil Toyota Corolla",
      "Supercars Chevrolet Camaro Gen 3", "Supercars Ford Mustang Gen 3",
    ],
    "Storiche": [
      "Aston Martin DBR9 GT1", "Audi 90 GTO", "Chevrolet Corvette C6.R GT1",
      "Ford GT GT2", "Nissan GTP ZX-T",
    ],
  },
  scoperte: {
    "Junior": [
      "Formula Vee", "Ray FF1600", "USF 2000",
      "Skip Barber Formula 2000", "FIA F4",
    ],
    "Formula 3": [
      "Dallara F3", "Super Formula Lights", "Dallara IL-15",
    ],
    "Top Formula": [
      "Dallara IR18", "Dallara iR-01", "Super Formula SF23 - Honda",
      "Super Formula SF23 - Toyota", "Mercedes-AMG W13 E Performance",
    ],
    "Storiche": [
      "Lotus 49", "Lotus 79",
    ],
  },
};

const TUTTE = "Tutte le vetture";

// i gruppi (nome sotto-categoria + vetture) di una macro-categoria, o di
// entrambe per "tutte" — usati sia per il filtro sia per l'elenco piatto
const gruppiDi = (cat) => {
  if (cat === "coperte") return Object.entries(AUTO_PER_CAT.coperte);
  if (cat === "scoperte") return Object.entries(AUTO_PER_CAT.scoperte);
  return [...Object.entries(AUTO_PER_CAT.coperte), ...Object.entries(AUTO_PER_CAT.scoperte)];
};

const autoDi = (cat) => gruppiDi(cat).flatMap(([, auto]) => auto);

// selezionabili nel filtro fino a un massimo di 4 (vedi MAX_OBIETTIVI)
const OBIETTIVI = [
  { k: "frenata", l: "Gestione frenata" },
  { k: "periferiche", l: "Consulenza su periferiche" },
  { k: "uscita_curve", l: "Uscita curve" },
  { k: "traiettorie", l: "Percorrenza e traiettorie" },
  { k: "nuovo_circuito", l: "Apprendere un nuovo circuito" },
  { k: "bagnato", l: "Guida sul bagnato" },
  { k: "gomme", l: "Gestione gomme" },
  { k: "setup", l: "Creazione setup" },
  { k: "qualifica", l: "Preparazione qualifica" },
  { k: "passo_gara", l: "Passo gara" },
  { k: "attacco_difesa", l: "Attacco e difesa" },
  { k: "strategia", l: "Supporto strategico" },
  { k: "altro", l: "Altro" },
];

const MAX_OBIETTIVI = 4;

// estremi dello slider del prezzo orario
const PREZZO_MIN = 9.99;
const PREZZO_MAX = 99;

/* ------------------ portafoglio ore: configurazione ------------------
   Numeri veri, non sparsi nel codice: il pilota non paga a sessione, ricarica
   un portafoglio di ore che poi alloca prenotando. Pagamento e integrazione
   Stripe restano simulati in questo giro, ma stati e saldo sono reali. */
const COMMISSIONE_CORDA_PCT = 0.18; // placeholder, sostituira' la commissione reale
const TETTO_ORE_MENSILI = 100; // saldo massimo consentito nel portafoglio
const DURATA_SESSIONE_ORE = 1; // ogni sessione prenotata vale 1 ora dal portafoglio
const FINESTRA_CANCELLAZIONE_ORE = 24; // sotto questa soglia, cancellare non rimborsa

// logistica della Scheda Pilota: lingua e fuso, stessa idea di FASCE_ORARIE
const LINGUE = [
  { k: "it", l: "Italiano" }, { k: "en", l: "English" }, { k: "es", l: "Español" },
  { k: "de", l: "Deutsch" }, { k: "fr", l: "Français" },
];
const FUSI = ["Europe/Rome", "Europe/London", "America/New_York", "America/Los_Angeles", "Australia/Sydney"];
// scarto in ore da UTC di ogni fuso — un solo valore fisso per fuso, niente
// calendario delle date legali reali: basta a mostrare "orario del coach"
// come annotazione nel calendario di allocazione, senza la complessita' di
// una conversione fusi-orari completa per un dato puramente informativo
const FUSI_OFFSET = { "Europe/Rome": 2, "Europe/London": 1, "America/New_York": -4, "America/Los_Angeles": -7, "Australia/Sydney": 10 };
const FUSO_PILOTA_DEFAULT = "Europe/Rome"; // la Scheda Pilota lo rende personalizzabile, ma quel valore e' locale al componente e non arriva qui

/* -------------------- calendario di allocazione ore: configurazione --------------------
   Ponte verso il vero calendario del coach (non ancora costruito): la disponibilita'
   si deriva dalle fasce orarie dichiarate (le stesse del questionario candidatura),
   non da uno slot-by-slot reale. orariDiFascia() e' l'UNICO punto che va sostituito
   quando esistera' un calendario coach vero — il resto del componente lavora già
   per slot orari singoli e non deve cambiare. */
const ORA_CALENDARIO_INIZIO = 8; // 08:00
const ORA_CALENDARIO_FINE = 22; // fino a 21:00-22:00, ultimo slot prenotabile alle 21:00
const GIORNI_SETTIMANA = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

// a quale fascia dichiarata appartiene un'ora di un certo giorno — bridge
// mock: quando esistera' la disponibilita' reale del coach, questa funzione
// si sostituisce con una vera lettura del suo calendario, senza toccare il
// resto del componente (che ragiona gia' per singolo slot ora+giorno)
function fasciaDiOrario(dataJs, ora) {
  const weekend = dataJs.getDay() === 0 || dataJs.getDay() === 6;
  if (!weekend) {
    if (ora >= 8 && ora < 12) return "Feriali mattina";
    if (ora >= 12 && ora < 18) return "Feriali pomeriggio";
    if (ora >= 18 && ora < 23) return "Feriali sera";
  } else {
    if (ora >= 9 && ora < 18) return "Weekend giorno";
    if (ora >= 18 && ora < 23) return "Weekend sera";
  }
  return null;
}

/* ---------------------------------- stile ---------------------------------- */

const CSS = `
/* Due famiglie, due voci — non due varianti della stessa: Fraunces è il
   testo che RACCONTA (titoli, paragrafi, didascalie discorsive — il corpo
   della pagina di base, vedi .crd), Saira Condensed è lo strumento che
   COMANDA E MISURA (bottoni, nav, etichette di campo, dati). Nessuna terza
   famiglia: i dati restano "misurati" per allineamento tabulare
   (font-variant-numeric, vedi .mn), non per un alfabeto da terminale. */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,500;1,600&family=Saira+Condensed:wght@500;600;700;800;900&display=swap');

/* azzera il margine di default del browser su body: senza, i 20px di
   padding laterale di .w si sommavano a un margine invisibile, riducendo
   lo spazio reale disponibile proprio dove serve di piu' (mobile stretto).
   text-size-adjust:100% disattiva il boost automatico del testo che alcuni
   browser/webview mobile applicano su pagine strette: senza, il testo puo'
   rendere piu' largo del previsto proprio sui telefoni reali, anche se in
   un test headless (dove il boost non scatta mai) sembra tutto a posto.
   overflow-x:hidden + max-width:100% e' la GUARDIA GLOBALE finale: qualunque
   elemento interno sfori comunque (un bug futuro, un contenuto non previsto)
   non apre piu' uno scroll orizzontale ne' un salto del layout — il sintomo
   che ha reso il bug visibile finora (logo tagliato a sinistra: il browser
   scorre la pagina per seguire il controllo che sfora) semplicemente non
   puo' piu' verificarsi qui, indipendentemente da dove nasce lo sforamento. */
html,body{margin:0;padding:0;-webkit-text-size-adjust:100%;text-size-adjust:100%;
  max-width:100%;overflow-x:hidden}

/* ---- identità "La traiettoria": tarmac caldo, non un nero da webapp.
   Un abitacolo è scuro, ma qui il fondo è asfalto — bruno-nero, non
   blu-nero — e il testo è gesso, non bianco puro: nessuno dei due è
   "neutro", sono entrambi presi dal tracciato. --linea è nuovo: il giallo
   cordolo che disegna la traiettoria/apice (vedi il momento firma
   nell'hero), riservato a QUELLO, mai al dato (--blu2) né al marchio
   (--rosso2) — tre accenti, tre significati, mai lo stesso colore per due
   cose diverse. */
.crd{
  --nero:#171512; --nero2:#221E19; --nero3:#2B251F; --bordo:#3A3229;
  --bianco:#F2EDE3; --grigio:#B7AE9E; --grigio2:#867A66;
  --rosso:#8A2E1F; --rosso2:#D4573E; --rossoSoft:rgba(212,87,62,.14);
  --blu:#3E9E90; --blu2:#6FD1C4; --bluSoft:rgba(111,209,196,.14);
  --ambra:#C97A3B; --ambraSoft:rgba(201,122,59,.14);
  --verde:#7FA33C; --verdeSoft:rgba(127,163,60,.14);
  --oro:#B08D57; --oroSoft:rgba(176,141,87,.14);
  /* azione distruttiva: variabile a parte, cosi' non si confonde con il
     marchio ne' con l'avviso — coincide col rosso di sempre, come da sempre */
  --distr:#8A2E1F; --distr2:#D4573E; --distrSoft:rgba(212,87,62,.14);
  /* hover dei bottoni primari, disaccoppiato da --blu2/--rosso2 */
  --bluHover:#5BC2B3; --rossoHover:#E06A50;
  /* colore del solo "numero-eroe" (es. il grande +iR in Home): segue
     --blu2, come tutti i dati verificati */
  --eroe:var(--blu2);
  --linea:#E8B94C;
  background:var(--nero); color:var(--bianco); min-height:100%;
  font-family:'Fraunces',Georgia,serif; -webkit-font-smoothing:antialiased; line-height:1.5;
}

/* ============================ TEMI ALTERNATIVI (nascosti, solo sviluppo) ============================
   Il selettore pubblico è sparito dall'header (il colore deve poter
   portare significato con UNA sola palette, non funzionare con cinque):
   questi blocchi restano nel codice, raggiungibili solo con ?tema=nome
   nell'URL — non sono più un A/B in corso, sono uno strumento per
   confrontare in futuro, se serve. "attuale" è l'esatta palette del giro
   precedente, conservata qui invece che persa. Nessuna regola di
   struttura tocca questi blocchi: solo variabili. */
.crd[data-theme="attuale"]{
  --nero:#0A0B0D; --nero2:#121418; --nero3:#1A1D23; --bordo:#282C34;
  --bianco:#FFFFFF; --grigio:#9BA3AF; --grigio2:#6B727D;
  --rosso:#8E1A20; --rosso2:#B32229; --rossoSoft:rgba(179,34,41,.12);
  --blu:#1D4FD7; --blu2:#3C6DF0; --bluSoft:rgba(29,79,215,.12);
  --ambra:#E2472A; --ambraSoft:rgba(226,71,42,.14);
  --verde:#1FAA59; --verdeSoft:rgba(31,170,89,.14);
  --oro:#E3A63A; --oroSoft:rgba(227,166,58,.14);
  --distr:#8E1A20; --distr2:#B32229; --distrSoft:rgba(179,34,41,.12);
  --bluHover:#3C6DF0; --rossoHover:#B32229;
  --eroe:var(--blu2);
}

/* ---- TEMA A — "Teal" (ispirato Mercedes): un solo accento, dato+marchio+
   primario coincidono. Distruttivo resta un rosso a parte, per non confondersi. */
.crd[data-theme="teal"]{
  --nero:#0A0A0A; --nero2:#141618; --nero3:#1B1E20; --bordo:#262A2C;
  --bianco:#FFFFFF; --grigio:#9BA3A6; --grigio2:#63696B;
  --rosso:#00A897; --rosso2:#00D2BE; --rossoSoft:rgba(0,210,190,.12);
  --blu:#00A897; --blu2:#00D2BE; --bluSoft:rgba(0,210,190,.12);
  --bluHover:#00D2BE; --rossoHover:#00D2BE;
  --verde:#00D2BE; --verdeSoft:rgba(0,210,190,.14);
  --oro:#9BA3A6; --oroSoft:rgba(155,163,166,.14);
  --ambra:#F5A623; --ambraSoft:rgba(245,166,35,.14);
  --distr:#E0454A; --distr2:#C93D42; --distrSoft:rgba(224,69,74,.12);
}

/* ---- TEMA B — "Papaya" (ispirato McLaren): marchio forte, ma dosato. Solo il
   numero-eroe (.numero-eroe) prende il papaya — i numeri normali (--blu2)
   restano chiari, cosi' il dato continua a leggersi come "misurato". */
.crd[data-theme="papaya"]{
  --nero:#010101; --nero2:#121212; --nero3:#1A1A1A; --bordo:#262626;
  --bianco:#FFFFFF; --grigio:#9A9A9A; --grigio2:#5E5E5E;
  --rosso:#D96C00; --rosso2:#FF8000; --rossoSoft:rgba(255,128,0,.12);
  --blu:#D96C00; --blu2:#F2F2F2; --bluSoft:rgba(255,128,0,.12);
  --bluHover:#FF9933; --rossoHover:#FF9933;
  --verde:#2FBF71; --verdeSoft:rgba(47,191,113,.14);
  --oro:#9A9A9A; --oroSoft:rgba(154,154,154,.14);
  --ambra:#E23B3B; --ambraSoft:rgba(226,59,59,.14);
  --distr:#B32229; --distr2:#8E1A20; --distrSoft:rgba(179,34,41,.12);
}
.crd[data-theme="papaya"]{ --eroe:var(--rosso2); }

/* ---- TEMA C — "Oro & Bordeaux": marchio e numero-eroe usano due tinte
   diverse (a differenza di Teal/Papaya, qui non coincidono). L'oro resta
   raro: sui bottoni prende un tono smorzato (--blu), sui numeri normali
   non compare affatto (--blu2 resta quasi bianco), e va solo sul singolo
   numero-eroe via --eroe. Il bordeaux fa da superficie/marchio (--rosso),
   con un tono piu' acceso per i piccoli testi (--rosso2), perche' il
   bordeaux pieno è troppo scuro per restare leggibile su nero. */
.crd[data-theme="oro-bordeaux"]{
  --nero:#141414; --nero2:#1E1B1C; --nero3:#262122; --bordo:#302A2B;
  --bianco:#FCFCFC; --grigio:#9A9A9A; --grigio2:#5E5E5E;
  --rosso:#3F0E1D; --rosso2:#A8385A; --rossoSoft:rgba(168,56,90,.14);
  --blu:#D99F0F; --blu2:#FCFCFC; --bluSoft:rgba(254,190,20,.12);
  --bluHover:#FEBE14; --rossoHover:#56172F;
  --verde:#3FB768; --verdeSoft:rgba(63,183,104,.14);
  --oro:#9A9A9A; --oroSoft:rgba(154,154,154,.14);
  --ambra:#E5643E; --ambraSoft:rgba(229,100,62,.14);
  --distr:#C0392B; --distr2:#9C2E22; --distrSoft:rgba(192,57,43,.12);
  --eroe:#FEBE14;
}

/* ---- TEMA D — "Menta & Navy": accento pressoche' unico (menta) su fondo
   navy, stessa logica a due toni di Teal (--rosso/--blu piu' smorzati,
   --rosso2/--blu2 piu' accesi per testo/bordi). Il Consigliato condivide
   la stessa menta, come da richiesta ("il colore eroe"). La menta e' chiara:
   sui bottoni pieni il testo deve restare scuro (regola dedicata sotto),
   non bianco come negli altri temi. */
.crd[data-theme="menta-navy"]{
  --nero:#0A0F1E; --nero2:#122046; --nero3:#1A2C5A; --bordo:#26386B;
  --bianco:#FBFBFB; --grigio:#ABABAB; --grigio2:#6B7488;
  --rosso:#6FC98A; --rosso2:#96DFA8; --rossoSoft:rgba(150,223,168,.12);
  --blu:#6FC98A; --blu2:#96DFA8; --bluSoft:rgba(150,223,168,.12);
  --bluHover:#96DFA8; --rossoHover:#96DFA8;
  --verde:#96DFA8; --verdeSoft:rgba(150,223,168,.14);
  --oro:#ABABAB; --oroSoft:rgba(171,171,171,.14);
  --ambra:#F2A93B; --ambraSoft:rgba(242,169,59,.14);
  --distr:#E0454A; --distr2:#C93D42; --distrSoft:rgba(224,69,74,.12);
}
.crd[data-theme="menta-navy"] .b-blu,
.crd[data-theme="menta-navy"] .b-rosso{color:var(--nero)}

.crd *{box-sizing:border-box}
/* regola globale anti-overflow (fix layout mobile, giro definitivo): il
   default CSS di un figlio flex/grid e' min-width:auto, cioe' "non
   restringerti sotto la larghezza del tuo contenuto" — e' la causa n.1 di
   etichette tagliate/righe che sforano, perche' un testo lungo in una
   riga stretta preferisce sforare piuttosto che andare a capo. Azzerarlo
   qui, una volta per tutta l'app, vuol dire che ogni testo dentro un
   flex/grid puo' SEMPRE restringersi e andare a capo prima di sforare —
   vale per i componenti di oggi e per quelli scritti domani, non serve
   ricordarsene schermata per schermata. Un elemento con una larghezza
   esplicita (es. .avat{width:44px}) non ne risente: min-width:0 conta solo
   quando qualcosa lo starebbe comunque comprimendo sotto il suo contenuto. */
.crd *{min-width:0}
/* i titoli sono editoriali (Fraunces, la stessa voce del corpo), non da
   cruscotto: Saira Condensed resta ai comandi (bottoni, nav) e ai dati —
   è la differenza fra "questa pagina racconta" e "questa pagina misura",
   e questa direzione ha scelto di raccontare */
.crd h1,.crd h2,.crd h3{font-family:'Fraunces',Georgia,serif;font-weight:600;line-height:1.05;margin:0;letter-spacing:-.01em}
/* niente font monospace: il "misurato" è l'allineamento tabulare (due cifre
   si confrontano in colonna, prima/dopo una sessione o un'allocazione), non
   un alfabeto da terminale — il font resta quello del corpo del testo */
.mn{font-variant-numeric:tabular-nums;font-feature-settings:"tnum" 1;font-weight:600}
.w{max-width:1080px;margin:0 auto;padding:0 20px}
/* didascalia, non eyebrow urlata: maiuscolo/tracking largo restano ai
   badge di stato veri (.stato, .irTag) — qui è solo un titoletto in
   maiuscolo naturale, un po' più marcato del testo attorno */
.eyebrow{font-family:'Saira Condensed',sans-serif;font-size:14px;font-weight:600;color:var(--grigio2);margin-bottom:6px}

/* ---- barra ---- */
.nav{position:sticky;top:0;z-index:40;background:rgba(10,11,13,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--bordo)}
/* flex-wrap qui e' innocuo su desktop (il contenuto entra sempre su una riga
   entro i 1080px di .w): serve solo da rete di sicurezza per il breakpoint
   mobile qui sotto, che forza --navcta a andare a capo su riga propria */
.navin{display:flex;align-items:center;gap:10px 18px;flex-wrap:wrap;min-height:62px}
.brand{font-family:'Saira Condensed',sans-serif;font-weight:800;font-size:21px;letter-spacing:.14em;cursor:pointer;
  background:none;border:0;color:var(--bianco);padding:0}
.brand i{color:var(--rosso2);font-style:normal}
.navlinks{display:none;gap:22px;margin-left:14px}
@media(min-width:820px){.navlinks{display:flex}}
.navlinks button{background:none;border:0;color:var(--grigio);font-size:14px;cursor:pointer;font-family:inherit;padding:4px 0}
.navlinks button:hover{color:var(--bianco)}
.navcta{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}
.temaSelect{background:var(--nero2);border:1px solid var(--bordo);color:var(--grigio);max-width:100%;
  font-family:'Saira Condensed',sans-serif;font-size:11px;padding:6px 8px;border-radius:2px;cursor:pointer}

/* ---- bottoni ---- */
.b{font-family:'Saira Condensed',sans-serif;font-weight:600;font-size:14px;letter-spacing:.01em;
  padding:11px 18px;border:1px solid transparent;cursor:pointer;border-radius:3px;transition:background .15s,border-color .15s}
.b:focus-visible{outline:2px solid var(--bianco);outline-offset:2px}
.b-rosso{background:var(--rosso);color:#fff}
.b-rosso:hover{background:var(--rossoHover)}
.b-blu{background:var(--blu);color:#fff}
.b-blu:hover{background:var(--bluHover)}
.b-distr{background:var(--distr);color:#fff}
.b-distr:hover{background:var(--distr2)}
.b-ghost{background:transparent;border-color:var(--bordo);color:var(--bianco)}
.b-ghost:hover{border-color:var(--grigio)}
.b-lg{padding:15px 26px;font-size:16px;width:100%}
@media(min-width:640px){.b-lg{width:auto}}

/* ---- slot media ---- */
.slot{position:relative;width:100%;border:1px dashed var(--bordo);background:
  repeating-linear-gradient(135deg,transparent,transparent 9px,rgba(255,255,255,.022) 9px,rgba(255,255,255,.022) 18px),var(--nero2);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:18px;text-align:center}
.slot code{font-size:12px;letter-spacing:.1em;color:var(--grigio);
  border:1px solid var(--bordo);padding:3px 9px}
.slot p{margin:0;font-size:12.5px;color:var(--grigio2);max-width:34ch;line-height:1.45}
.slot span{font-family:'Saira Condensed',sans-serif;font-size:10.5px;color:var(--bordo);letter-spacing:.1em}
.slot video,.slot img{width:100%;height:100%;object-fit:cover;display:block}
.media{overflow:hidden;background:var(--nero2);border:1px solid var(--bordo)}
.media video,.media img{width:100%;height:100%;object-fit:cover;display:block}

/* ---- home ---- */
.hero{padding:64px 0 56px;border-bottom:1px solid var(--bordo)}
@media(min-width:900px){.hero{padding:88px 0 76px}}
/* ---- pista continua: un solo <svg> dietro hero + fascia numeri + "come
   funziona" (vedi PistaContinua) --------------------------------------
   overflow:hidden qui e' la rete di sicurezza: la curva e' pensata per
   uscire visivamente dai bordi della zona, overflow:hidden la ritaglia
   pulita senza MAI poter aprire uno scroll orizzontale — e vale anche
   durante l'animazione di ingresso dei tre passaggi (translateX), non
   solo a riposo, perche' il contenitore che clippa e' lo stesso per
   tutta la zona. */
/* z-index:0 qui non e' decorativo: senza un valore esplicito,
   position:relative da solo NON crea un nuovo contesto di stacking, e lo
   z-index:-1 dell'SVG sotto sarebbe "scappato" al contesto dell'antenato
   piu' vicino che ne ha uno (probabilmente la radice della pagina) invece
   di restare dietro solo al contenuto di questa zona — risultato: SVG
   presente nel DOM, geometria corretta, ma dipinto altrove e invisibile */
.pistaZona{position:relative;z-index:0;overflow:hidden}
/* z-index NEGATIVO, non 0: hero/fascia numeri/"come funziona" sono div
   statici (senza position/z-index propri) — in CSS, i discendenti statici
   dipingono SOPRA ai discendenti posizionati con z-index:0, non sotto.
   Con z-index negativo l'SVG dipinge nel livello sotto lo sfondo del
   contenuto normale, che è esattamente il "dietro al testo" richiesto,
   senza dover aggiungere z-index:1 a ogni sezione che ci sta sopra. */
.pistaSvg{position:absolute;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:.9}
@media(max-width:640px){
  /* su schermi stretti la banda non deve invadere il testo: piu' sottile
     e piu' tenue, non sparita — resta "riconoscibile come pista" */
  .pistaSvg{opacity:.4}
}
/* bordo/asfalto: stesso <path> disegnato due volte, larghezze diverse —
   il layer sotto (bianco, largo) resta visibile solo ai due bordi del
   layer sopra (asfalto, piu' stretto): un margine "parallelo" per
   costruzione lungo qualunque curva, senza calcolare un vero offset
   geometrico (che richiederebbe una libreria dedicata) — sono i due
   "track limits" bianchi ai bordi della fascia. vector-effect e'
   necessario: il viewBox e' deformato apposta (preserveAspectRatio none)
   per adattarsi a container di proporzioni diverse, e senza
   non-scaling-stroke lo spessore del tratto si deformerebbe con lui —
   con non-scaling-stroke resta in pixel reali, costante. --bordo (grigio
   caldo, piu' chiaro del fondo --nero ma neutro, non colorato) e' la
   fascia d'asfalto vera e propria, larga abbastanza da leggersi come
   pista e non come un filo */
.pistaLayer{stroke-linecap:round;vector-effect:non-scaling-stroke}
.pistaBordo{stroke:var(--bianco);stroke-width:19}
.pistaAsfalto{stroke:var(--bordo);stroke-width:14}
@media(max-width:640px){.pistaBordo{stroke-width:11}.pistaAsfalto{stroke-width:8}}
/* cordolo: tacche vere, perpendicolari alla direzione di marcia sullo
   SCHERMO (calcolate in JS, vedi PistaContinua — il viewBox deformato
   rende impossibile ottenerle con un angolo fisso nel markup), solo sul
   tratto del tornante nell'hero — non su tutto il percorso. Rosso di
   marca qui non confligge con la triade di stato (verde/oro/ambra restano
   intatti) — e' l'unico secondo uso del marchio in tutta l'home, oltre al
   logo */
.pistaCordoloGruppo{transition:opacity .5s ease}
.pistaTacca{stroke-width:7;vector-effect:non-scaling-stroke}
@media(max-width:640px){.pistaTacca{stroke-width:5}}
.pistaTacca[data-tinta="a"]{stroke:var(--rosso2)}
.pistaTacca[data-tinta="b"]{stroke:var(--bianco)}
/* nodo: marcatore discreto (non un disco) che "si accende" quando la
   linea raggiunge l'aggancio di un passaggio — vedi il trigger nel
   commento di PistaContinua. transform-origin al centro cosi' lo scale
   rimane concentrico invece di spostare il punto */
.pistaNodo{stroke:var(--linea);stroke-width:7;stroke-linecap:round;
  transform-origin:center;transform-box:fill-box;transition:opacity .3s ease,transform .3s ease}
@media(max-width:640px){.pistaNodo{stroke-width:6}}
@media(prefers-reduced-motion:reduce){
  .pistaCordoloGruppo,.pistaNodo{transition:none}
}
.herogrid{display:grid;gap:38px;grid-template-columns:1fr;align-items:start;position:relative;z-index:1}
@media(min-width:900px){.herogrid{grid-template-columns:1.28fr .72fr;gap:44px}}
.heroMedia{width:100%}
@media(min-width:900px){.heroMedia{margin-top:64px}}
.h1{font-size:clamp(34px,6.4vw,58px);font-style:normal}
.h1riga{display:block}
@media(min-width:640px){
  .h1riga:nth-child(2){margin-left:5%}
  .h1riga:nth-child(3){margin-left:11%}
}
.h1 em{font-style:italic}
.lead{color:var(--grigio);font-size:17px;line-height:1.6;margin:20px 0 28px;max-width:46ch}
.ctas{display:flex;flex-direction:column;gap:10px}
@media(min-width:640px){.ctas{flex-direction:row}}
.plat{display:inline-flex;align-items:center;gap:9px;border:1px solid var(--bordo);background:var(--nero2);
  padding:7px 12px;font-family:'Saira Condensed',sans-serif;font-size:11.5px;letter-spacing:.12em;color:var(--grigio);margin-bottom:24px;
  max-width:100%;flex-wrap:wrap}
.plat i{width:7px;height:7px;border-radius:50%;background:var(--blu2);display:inline-block}
/* solo altezza, mai altezza+larghezza insieme: la larghezza segue da sola
   per rispettare le proporzioni del file (640x490), qualunque esse siano —
   vale anche se un giorno LOGO_IRACING_DATAURI punta a un SVG con un
   rapporto diverso. 32px e' una dimensione da logo autonomo (non piu'
   accostato a una riga di testo come nella versione con riquadro), ben
   sotto la dimensione naturale del file quindi non lo ingrandisce mai.
   margin-bottom riprende quella che aveva .plat, per non cambiare lo
   spazio verso il titolo sotto */
.platLogoStandalone{height:32px;width:auto;display:block;margin-bottom:24px}

/* l'autocritica del giro: una fascia di 4 numeri, presa cosi' com'era,
   e' il pezzo di pagina piu' generico rimasto — andrebbe bene per
   qualunque prodotto con delle statistiche. Un filo di --linea sopra
   (secondo e ultimo uso della traiettoria in tutta la pagina, dopo
   l'hero) basta a dirle "riga di settore letta a fine giro", non
   "banner di metriche" */
.band{border-top:2px solid var(--linea);border-bottom:1px solid var(--bordo);background:var(--nero2)}
.bandin{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--bordo)}
@media(min-width:760px){.bandin{grid-template-columns:repeat(4,1fr)}}
.bcell{background:var(--nero2);padding:22px 18px}
.bcell b{display:block;font-family:'Saira Condensed',sans-serif;font-size:29px;font-weight:700;letter-spacing:-.02em}
.bcell span{font-family:'Saira Condensed',sans-serif;font-size:13.5px;color:var(--grigio2);margin-top:4px;display:block}

.sez{padding:70px 0;border-bottom:1px solid var(--bordo)}
.sezhead{max-width:56ch;margin-bottom:38px}
.h2{font-size:clamp(28px,4.6vw,40px);margin-top:12px}
.p{color:var(--grigio);font-size:16px;line-height:1.65;margin-top:14px}

/* i tre passaggi in fila, non piu' affiancati: e' l'ordine in cui la
   pista li raggiunge scendendo (vedi PistaContinua), non una scelta di
   stile. position:relative+z-index:1 li tiene sopra alla curva (che
   passa dietro, z-index:-1) senza bisogno di un fondo opaco proprio —
   restano "sulla pista", non su un riquadro che la copre. */
.passi{display:flex;flex-direction:column;gap:56px;position:relative;z-index:1}
@media(min-width:900px){.passi{gap:76px}}
/* transform e' l'UNICA proprieta' che PistaContinua scrive qui via ref
   (mai left/margin/width, vedi il vincolo anti-overflow): translateX
   parte gia' a 0 di default (nessuno stile in JSX), lo sposta solo
   l'effect quando puo' partire — stato di riposo sempre corretto senza
   JS. will-change lo dichiara al browser solo dove serve */
.passo{display:grid;gap:24px;grid-template-columns:1fr;align-items:center;will-change:transform,opacity}
@media(min-width:820px){
  .passo{grid-template-columns:1fr 1.15fr;gap:40px}
  /* l'alternanza testo/video rispecchia da che lato "entra" ogni
     passaggio scorrendo (01 sinistra, 02 destra, 03 sinistra): non solo
     l'animazione, anche la composizione a riposo lo racconta */
  .passo.passoInverso{grid-template-columns:1.15fr 1fr}
  .passo.passoInverso .passoMedia{order:2}
  .passo.passoInverso .passoTesto{order:1}
}
.passoMedia{width:100%}
.passo .num{font-family:'Saira Condensed',sans-serif;font-size:28px;font-weight:800;color:var(--grigio2);margin-bottom:10px}
.passo h3{font-size:21px;margin-bottom:8px}
.passo p{color:var(--grigio);font-size:14.5px;line-height:1.6;margin:0 0 16px}
@media(prefers-reduced-motion:reduce){.passo{transform:none !important;opacity:1 !important}}

.duo{display:grid;gap:34px;grid-template-columns:1fr;align-items:center}
@media(min-width:900px){.duo{grid-template-columns:1fr 1fr;gap:52px}}
.metric{border:1px solid var(--bordo);background:var(--nero2);padding:22px}
.metric .big{font-family:'Saira Condensed',sans-serif;font-size:52px;font-weight:800;letter-spacing:-.03em;line-height:1}
/* il numero-eroe (es. il grande +iR) segue --eroe: coincide col dato
   verificato in Attuale/Teal/Menta&Navy, prende un tono dedicato e dosato
   in Papaya e Oro&Bordeaux (vedi definizioni di --eroe nei blocchi tema) */
.numero-eroe{color:var(--eroe)}
.metric .sm{font-family:'Saira Condensed',sans-serif;font-size:12px;color:var(--grigio2);margin-top:8px;letter-spacing:.06em}
.check{list-style:none;padding:0;margin:20px 0 0}
.check li{position:relative;padding-left:24px;margin-bottom:12px;color:var(--grigio);font-size:15px;line-height:1.55}
.check li::before{content:"";position:absolute;left:0;top:8px;width:9px;height:9px;background:var(--grigio2)}

.due{display:grid;gap:16px;grid-template-columns:1fr}
@media(min-width:760px){.due{grid-template-columns:1fr 1fr}}
.porta{border:1px solid var(--bordo);background:var(--nero2);padding:26px;display:flex;flex-direction:column}
.porta.blu{border-top:3px solid var(--blu)}
.porta.rossa{border-top:3px solid var(--rosso2)}
.porta h3{font-size:23px;margin-bottom:10px}
.porta p{color:var(--grigio);font-size:14.5px;line-height:1.6;flex:1;margin:0 0 20px}

.faq{border-top:1px solid var(--bordo)}
.faq details{border-bottom:1px solid var(--bordo);padding:18px 0}
.faq summary{cursor:pointer;font-family:'Saira Condensed',sans-serif;font-weight:600;font-size:16.5px;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq summary::before{content:"+ ";color:var(--grigio)}
.faq details[open] summary::before{content:"− "}
.faq p{color:var(--grigio);font-size:14.5px;line-height:1.65;margin:12px 0 0;max-width:64ch}

.foot{padding:44px 0 60px;color:var(--grigio2);font-size:13px;line-height:1.7}
.footgrid{display:flex;flex-wrap:wrap;gap:28px;justify-content:space-between;align-items:flex-start}

/* ---- login ---- */
.auth{min-height:calc(100vh - 62px);display:flex;align-items:center;justify-content:center;padding:40px 20px}
.authbox{width:100%;max-width:420px;border:1px solid var(--bordo);background:var(--nero2);padding:28px}
.tabs{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid var(--bordo);margin:20px 0 22px}
.tabs button{background:transparent;border:0;padding:12px;cursor:pointer;color:var(--grigio);
  font-family:'Saira Condensed',sans-serif;font-weight:600;font-size:14px}
.tabs button[data-on="1"][data-r="pilota"]{background:var(--blu);color:#fff}
.tabs button[data-on="1"][data-r="coach"]{background:var(--rosso);color:#fff}
.campo{margin-bottom:14px}
/* diretto, non discendente: senza, questa regola scavalcava anche le label
   dei checkbox dentro un .checkgrid annidato in un .campo (font monospace
   piu' largo del previsto, mai emerso finche' il testo dei checkbox non e'
   stato abbastanza lungo da sforare il contenitore) */
.campo > label{display:block;font-family:'Saira Condensed',sans-serif;font-size:14px;font-weight:600;color:var(--grigio2);margin-bottom:6px}
/* :not(checkbox/radio) — stessa famiglia di bug della regola sopra, mai
   corretta insieme ad essa: senza l'esclusione, questa regola raggiungeva
   anche i checkbox di un .checkgrid annidato in un .campo (Scheda Pilota,
   Candidatura) e li stirava a width:100% del proprio contenitore — una
   casella diventa una barra larga quanto la riga, con l'etichetta spinta
   di lato: esattamente il bug "casella a un estremo, etichetta all'altro,
   vuoto in mezzo" segnalato. Qui si corregge alla radice, non sulle singole
   schermate dove si è visto: vale per ogni .campo, presente e futuro. */
.campo input:not([type="checkbox"]):not([type="radio"]){width:100%;background:var(--nero);border:1px solid var(--bordo);color:var(--bianco);
  padding:11px 12px;font-family:'Saira Condensed',sans-serif;font-size:14px;border-radius:2px}
.campo input:focus{outline:none;border-color:var(--grigio)}
.campo select,.campo textarea{width:100%;background:var(--nero);border:1px solid var(--bordo);color:var(--bianco);
  padding:11px 12px;font-family:'Saira Condensed',sans-serif;font-size:14px;border-radius:2px}
.campo textarea{resize:vertical;min-height:88px;line-height:1.5}
.campo select:focus,.campo textarea:focus{outline:none;border-color:var(--grigio)}
/* riga opzione con checkbox (componente OpzioneCheck, riusato ovunque serva
   una lista di caselle): sempre una singola riga flex, casella a sinistra
   a dimensione fissa (flex:0 0 auto, non si stira mai), etichetta in uno
   <span> a destra che invece puo' SEMPRE restringersi e andare a capo
   (flex:1 1 auto + min-width:0) invece di tagliarsi o spingere la casella
   fuori dal contenitore — questa e' la regola, non una correzione per
   schermata: cambia qui e vale per fasce orarie, obiettivi e ogni lista
   analoga scritta in futuro. */
.checkgrid{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.checkgrid label{display:flex;align-items:center;gap:10px;flex-shrink:0;white-space:nowrap;
  border:1px solid var(--bordo);padding:8px 12px;font-size:13px;cursor:pointer;border-radius:2px;color:var(--grigio);
  transition:transform .12s ease}
.checkgrid label:has(input:checked){border-color:var(--blu2);color:var(--blu2);background:var(--bluSoft);transform:scale(1.02)}
@media(prefers-reduced-motion:reduce){.checkgrid label{transition:none}}
.checkgrid input{accent-color:var(--blu2);flex:0 0 auto}
/* white-space non va ripetuto qui: e' una proprieta' ereditata, segue
   sempre quella della <label> (nowrap sui chip da desktop, normal sotto
   i 640px) — basta cambiarla in un solo punto, vedi media query sotto */
.checkgrid label>span{flex:1 1 auto;min-width:0}
.hintbox{border-left:2px solid var(--bordo);padding-left:12px;margin-top:18px;color:var(--grigio2);font-size:12.5px;line-height:1.6}

/* ---- app ---- */
.appbar{border-bottom:1px solid var(--bordo);background:var(--nero2)}
.appbarin{display:flex;align-items:center;gap:4px;height:50px;overflow-x:auto}
.appbarin button{background:none;border:0;border-bottom:2px solid transparent;color:var(--grigio);
  padding:14px 12px;cursor:pointer;font-family:'Saira Condensed',sans-serif;font-weight:600;font-size:14px;white-space:nowrap}
/* la scheda attiva si segnala col bianco pieno, non col rosso di marca:
   "dove sono" è uno stato dell'interfaccia, non un momento di marchio —
   tenerli separati evita che il rosso perda significato a forza di
   comparire ovunque */
.appbarin button[data-on="1"]{color:var(--bianco);border-bottom-color:var(--bianco)}
.appbarin .esci{margin-left:auto;color:var(--grigio2);font-size:13px;font-weight:500;
  white-space:nowrap;flex:none}
/* "Scheda Pilota" prende lo spazio a destra lasciato libero dall'identita',
   ora spostata nell'header (punto 1) */
.appbarin .schedaTab{margin-left:auto}

.filtri{border:1px solid var(--bordo);background:var(--nero2);margin:22px 0}
.fhead{padding:10px 14px;border-bottom:1px solid var(--bordo);font-family:'Saira Condensed',sans-serif;
  font-size:14px;font-weight:600;color:var(--grigio2);display:flex;justify-content:space-between}
.frow{display:flex;align-items:center;gap:12px;padding:11px 14px;border-bottom:1px solid var(--bordo)}
.frow:last-child{border-bottom:0}
.frow.hi{background:var(--bluSoft)}
.frow > label{font-family:'Saira Condensed',sans-serif;font-size:14px;font-weight:600;color:var(--grigio2);width:132px;flex:none}
.frow.hi > label{color:var(--blu2)}
/* stessa esclusione di .campo input, stessa ragione: il filtro "Obiettivo"
   nella Cerca annida un .checkgrid dentro un .frow, e senza :not(...) questa
   regola dava flex:1 anche ai suoi checkbox, stirandoli a riempire l'intera
   riga (il caso piu' vistoso del bug: la casella diventava un rettangolo
   largo quanto tutta la riga, il testo spinto ai margini). */
.frow select,.frow input:not([type="checkbox"]):not([type="radio"]){flex:1;min-width:0;background:var(--nero);color:var(--bianco);border:1px solid var(--bordo);
  padding:8px 10px;font-family:'Saira Condensed',sans-serif;font-size:13px;border-radius:2px}
.frow input::placeholder{color:var(--grigio2)}

/* ---- fix layout mobile: niente contenitori piu' larghi del viewport ----
   Sotto ai 640px le righe dei filtri (etichetta | controllo) si impilano,
   la barra "Tema"/Esci va a capo su riga propria invece di affollare
   l'header, e i controlli toccabili salgono a un'altezza comoda al dito. */
@media(max-width:640px){
  .navcta{flex-basis:100%}
  .frow{flex-direction:column;align-items:stretch;gap:6px}
  .frow > label{width:auto}
  .frow select,.frow input,.temaSelect{min-height:44px}
  /* una casella per riga, a piena larghezza: niente colonne affiancate che
     possano stringersi fino a sovrapporsi. white-space torna a "normal"
     cosi' un'etichetta lunga va a capo dentro la sua riga invece di
     spingere il bordo della casella fuori dal viewport */
  .checkgrid{flex-direction:column}
  .checkgrid label{min-height:44px;padding:10px 14px;width:100%;white-space:normal;flex-shrink:1}
  .b{min-height:44px;display:inline-flex;align-items:center;justify-content:center}
  .emailBanner{position:static;top:auto}
}

.lista{display:grid;gap:14px;grid-template-columns:1fr;margin:20px 0 40px}
@media(min-width:780px){.lista{grid-template-columns:1fr 1fr}}
/* la card-coach è una decisione da prendere, non una riga informativa: un
   bordo un filo più presente di .blocco (usato per riepiloghi, non per
   scegliere) basta a farla pesare di più, senza ricorrere a ombre o raggi
   diversi — la stessa griglia piatta, solo un contorno più netto dove
   davvero si clicca per decidere */
.cc{border:1px solid var(--grigio2);background:var(--nero2);padding:18px;text-align:left;cursor:pointer;
  color:inherit;font:inherit;width:100%;transition:border-color .16s,transform .16s}
.cc:hover{border-color:var(--grigio);transform:translateY(-2px)}
.cc:focus-visible{outline:2px solid var(--blu2);outline-offset:2px}
.cctop{display:flex;gap:12px;align-items:center}
.avat{width:44px;height:44px;flex:none;background:var(--nero3);border:1px solid var(--bordo);
  display:flex;align-items:center;justify-content:center;font-family:'Saira Condensed',sans-serif;font-weight:700;color:var(--grigio)}
.ccnome{font-family:'Saira Condensed',sans-serif;font-weight:700;font-size:18px}
.ccsub{font-family:'Saira Condensed',sans-serif;font-size:11.5px;color:var(--grigio2)}
.ccmetr{display:flex;align-items:flex-end;gap:14px;margin-top:16px}
.ccbig{font-family:'Saira Condensed',sans-serif;font-weight:800;font-size:30px;color:var(--blu2);letter-spacing:-.02em;line-height:1}
.ccsm{font-family:'Saira Condensed',sans-serif;font-size:11px;color:var(--grigio2);line-height:1.5}
.fit{margin-top:14px;border:1px solid var(--blu2);background:var(--bluSoft);padding:9px 11px;font-size:13px}
.fit b{color:var(--blu2)}
.fit.no{border-color:var(--bordo);background:var(--nero);color:var(--grigio2)}
.stato{display:inline-flex;align-items:center;font-family:'Saira Condensed',sans-serif;font-size:10.5px;
  letter-spacing:.1em;text-transform:uppercase;padding:4px 9px;border:1px solid transparent;border-radius:2px}
.stato-consigliato{background:var(--verde);color:#fff}
.stato-neutro{background:var(--oro);color:#241A05}
.stato-avviso{background:var(--ambra);color:#fff}
.notaBox{border:1px solid var(--bordo);background:var(--nero2);padding:14px 16px;margin-top:10px;font-size:13px;line-height:1.6}
.notaBox b{color:var(--bianco)}
.notaBox.ambra{border-color:var(--ambra);background:var(--ambraSoft)}
.notaBox.ambra b{color:var(--ambra)}
.notaBox.rossa{border-color:var(--rosso2);background:var(--rossoSoft)}
.notaBox.rossa b{color:var(--rosso2)}
.notaBox.distr{border-color:var(--distr);background:var(--distrSoft)}
.notaBox.distr b{color:var(--distr2)}
.altList{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.altList button{background:var(--nero);border:1px solid var(--bordo);color:var(--bianco);
  font-family:'Saira Condensed',sans-serif;font-size:11.5px;padding:6px 10px;cursor:pointer;border-radius:2px}
.altList button:hover{border-color:var(--blu2);color:var(--blu2)}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}
.chip{font-family:'Saira Condensed',sans-serif;font-size:10.5px;letter-spacing:.06em;border:1px solid var(--bordo);
  color:var(--grigio2);padding:4px 8px}
.chip.p{border-color:var(--rosso2);color:var(--rosso2)}
.specbox{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.specbox-item{border:1px solid var(--bordo);background:var(--nero3);color:var(--bianco);
  padding:8px 12px;font-size:12.5px;font-weight:600;border-radius:3px}
.ccfoot{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:14px;border-top:1px solid var(--bordo)}
.prezzo{font-family:'Saira Condensed',sans-serif;font-weight:700;font-size:20px}
.prezzo.lg{font-size:32px}
.prezzo small{color:var(--grigio2);font-weight:500;font-size:12px}

/* ---- slider prezzo a due cursori ---- */
.rangewrap{position:relative;height:30px;margin-top:6px}
.rangetrack{position:absolute;top:13px;left:0;right:0;height:4px;background:var(--bordo);border-radius:2px}
.rangefill{position:absolute;top:13px;height:4px;background:var(--blu2);border-radius:2px}
.rangewrap input[type="range"]{position:absolute;top:11px;left:0;width:100%;margin:0;background:transparent;
  -webkit-appearance:none;appearance:none;pointer-events:none}
.rangewrap input[type="range"]::-webkit-slider-runnable-track{height:8px;background:transparent}
.rangewrap input[type="range"]::-moz-range-track{height:8px;background:transparent;border:none}
.rangewrap input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;pointer-events:auto;
  width:18px;height:18px;border-radius:50%;background:var(--blu2);border:2px solid var(--nero);
  cursor:pointer;margin-top:-5px}
.rangewrap input[type="range"]::-moz-range-thumb{pointer-events:auto;width:18px;height:18px;border-radius:50%;
  background:var(--blu2);border:2px solid var(--nero);cursor:pointer}

.blocco{border:1px solid var(--bordo);background:var(--nero2);padding:18px}
.riga{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--bordo);font-size:14px;align-items:baseline}
.riga:last-child{border-bottom:0}
.riga .nn{font-family:'Saira Condensed',sans-serif;font-size:11px;color:var(--grigio2)}
.stit{font-family:'Saira Condensed',sans-serif;font-size:15px;font-weight:600;color:var(--grigio2);
  border-bottom:1px solid var(--bordo);padding-bottom:8px;margin:32px 0 14px;
  display:flex;justify-content:space-between;gap:10px}
.nota{font-size:12.5px;color:var(--grigio2);line-height:1.6;margin-top:12px}
.indietro{background:none;border:0;color:var(--grigio2);cursor:pointer;font-size:13px;padding:18px 0 6px;font-family:'Saira Condensed',sans-serif}
.slotchip{border:1px solid var(--bordo);background:var(--nero);color:var(--bianco);padding:11px;
  cursor:pointer;font-family:'Saira Condensed',sans-serif;font-size:13px;border-radius:2px}
.slotchip[data-on="1"]{border-color:var(--blu2);background:var(--bluSoft);color:var(--blu2)}
.slotgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
.ok{border:1px solid var(--blu);background:var(--bluSoft);padding:20px;margin:22px 0}
.avviso{border:1px solid var(--rosso2);background:var(--rossoSoft);padding:14px;font-size:13.5px;line-height:1.55;margin-bottom:16px}
.kpigrid{display:grid;gap:14px;grid-template-columns:1fr}
@media(min-width:620px){.kpigrid{grid-template-columns:1fr 1fr}}
.kbox{border:1px solid var(--bordo);background:var(--nero2);padding:18px}
.klab{font-family:'Saira Condensed',sans-serif;font-size:13.5px;font-weight:600;color:var(--grigio2)}
.kval{font-family:'Saira Condensed',sans-serif;font-weight:800;font-size:32px;margin-top:8px;letter-spacing:-.02em}
.apri{background:none;border:0;color:var(--blu2);cursor:pointer;font-family:'Saira Condensed',sans-serif;font-size:12px;padding:10px 0;text-align:left}
.regole{border-left:2px solid var(--bordo);padding-left:14px;margin:4px 0 0}
.regole li{font-size:12.5px;color:var(--grigio2);line-height:1.55;margin-bottom:8px}
.recens{border-left:2px solid var(--bordo);padding-left:14px;margin-bottom:16px}
.recens p{font-size:14px;line-height:1.6;margin:7px 0}
.recmeta{display:flex;gap:12px;flex-wrap:wrap;font-family:'Saira Condensed',sans-serif;font-size:11.5px;color:var(--grigio2)}
.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;vertical-align:middle}
.orebar{height:8px;background:var(--bordo);border-radius:4px;overflow:hidden;margin-top:14px}
.orebarfill{height:100%;background:var(--blu2)}

/* ---- pacchetti ore: auto-fit si impila da solo sotto un certo spazio,
   niente media query dedicata da mantenere in giro ---- */
.offerteGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-top:14px}
.offertaCard{border:1px solid var(--bordo);background:var(--nero);padding:14px;text-align:center}
.lockbox{border:1px dashed var(--bordo);background:var(--nero2);padding:22px}

/* ---- calendario di allocazione: griglia settimanale (largo) + agenda a
   giorno singolo (mobile) sullo stesso stato — vedi CalendarioAllocazione.
   Di default la griglia e' visibile e l'agenda no; sotto i 640px si scambia,
   stessa logica di visibilita' gia' usata per .navlinks/.checkgrid altrove. */
.calNav{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:14px 0}
.calNav .b{min-height:44px}
.calNavLabel{font-family:'Saira Condensed',sans-serif;font-size:11.5px;color:var(--grigio2);text-align:center}
.calGridWrap{overflow-x:auto;margin:14px 0}
.calGrid{display:grid;grid-template-columns:60px repeat(7,minmax(64px,1fr));gap:1px;
  background:var(--bordo);border:1px solid var(--bordo);min-width:560px}
.calGridHeadCell{background:var(--nero2);padding:8px 4px;text-align:center;
  font-family:'Saira Condensed',sans-serif;font-size:10px;letter-spacing:.08em;color:var(--grigio2)}
.calGridHeadCell b{display:block;color:var(--bianco);font-size:15px;font-family:'Saira Condensed',sans-serif;font-weight:700}
.calGridOra{background:var(--nero2);color:var(--grigio2);font-family:'Saira Condensed',sans-serif;
  font-size:10px;padding:6px 6px;display:flex;align-items:center;justify-content:flex-end}
.calCell{background:var(--nero);border:0;color:var(--bianco);min-height:34px;cursor:pointer;
  font-family:'Saira Condensed',sans-serif;font-size:10px;padding:2px;text-align:center}
.calCell small{display:block;opacity:.7;font-size:8.5px}
.calCell[data-stato="libero"]:hover{background:var(--nero3)}
/* movimento che risponde a un'azione, non decorativo: selezionare uno slot
   lo fa "scattare" leggermente — mostra che qualcosa È cambiato, non solo
   che è cambiato un colore. Solo transform, e riparte ogni volta che lo
   stato torna "selezionato" (anche per lo stesso slot, se lo riselezioni) */
.calCell[data-stato="selezionato"]{background:var(--bluSoft);color:var(--blu2);font-weight:700;animation:scattaSelezione .16s ease-out}
.calCell[data-stato="occupato"]{background:var(--nero2);color:var(--grigio2);cursor:not-allowed}
.calCell[data-stato="non-disponibile"]{background:var(--nero2);color:var(--grigio2);opacity:.32;cursor:not-allowed}
.calCell[data-stato="passato"]{background:var(--nero2);color:var(--grigio2);opacity:.22;cursor:not-allowed}
.calAgenda{display:none}
.calAgendaRow{width:100%;min-height:44px;display:flex;justify-content:space-between;align-items:center;
  gap:10px;padding:10px 14px;border:1px solid var(--bordo);background:var(--nero2);color:var(--bianco);
  margin-bottom:6px;font-family:'Saira Condensed',sans-serif;font-size:12.5px;text-align:left;cursor:pointer}
.calAgendaRow[data-stato="selezionato"]{border-color:var(--blu2);background:var(--bluSoft);color:var(--blu2);animation:scattaSelezione .16s ease-out}
@keyframes scattaSelezione{from{transform:scale(.94)}to{transform:scale(1)}}
@media(prefers-reduced-motion:reduce){
  .calCell[data-stato="selezionato"],.calAgendaRow[data-stato="selezionato"]{animation:none}
}
.calAgendaRow[data-stato="occupato"],.calAgendaRow[data-stato="non-disponibile"],
.calAgendaRow[data-stato="passato"]{opacity:.5;cursor:not-allowed}
@media(max-width:640px){
  .calGridWrap{display:none}
  .calAgenda{display:block}
}
.azsess{font-family:'Saira Condensed',sans-serif;font-size:11.5px;letter-spacing:.04em;
  border:1px solid var(--bordo);background:var(--nero);padding:6px 12px;cursor:pointer;border-radius:2px}
.azsess.sposta{color:var(--blu2)}
.azsess.sposta:hover{border-color:var(--blu2)}
.azsess.cancella{color:var(--distr2)}
.azsess.cancella:hover{border-color:var(--distr2)}
.azsess.avvia{color:var(--verde)}
.azsess.avvia:hover{border-color:var(--verde)}
.badge{display:inline-flex;align-items:center;justify-content:center;min-width:16px;height:16px;
  padding:0 4px;margin-left:7px;border-radius:8px;background:var(--ambra);color:#fff;
  font-family:'Saira Condensed',sans-serif;font-size:10px;font-weight:600;vertical-align:middle}
.chatBox{border:1px solid var(--bordo);background:var(--nero2);padding:16px;margin-top:20px;
  display:flex;flex-direction:column;gap:10px;max-height:60vh;overflow-y:auto}
.msg{max-width:78%;padding:9px 12px;border-radius:3px;font-size:14px;line-height:1.5}
.msg p{margin:0}
.msg .msgOra{display:flex;align-items:center;gap:8px;margin-top:5px;
  font-family:'Saira Condensed',sans-serif;font-size:10px;opacity:.75}
.msg.loro{align-self:flex-start;background:var(--nero3);color:var(--bianco);border:1px solid var(--bordo)}
.msg.mio{align-self:flex-end;background:var(--blu);color:#fff}
.msgAzione{background:none;border:0;padding:0;cursor:pointer;font-family:'Saira Condensed',sans-serif;
  font-size:10px;text-decoration:underline;color:inherit;opacity:.9}
.msgAzione.fatta{text-decoration:none;cursor:default}
.chatInput{display:flex;gap:10px;margin-top:14px}
.chatInput input{flex:1;background:var(--nero);border:1px solid var(--bordo);color:var(--bianco);
  padding:11px 12px;font-family:'Saira Condensed',sans-serif;font-size:14px;border-radius:2px}
.chatInput input:focus{outline:none;border-color:var(--grigio)}
.citarow{display:flex;justify-content:space-between;gap:12px;width:100%;text-align:left;
  background:none;border:0;color:inherit;font:inherit;cursor:pointer;padding:10px 0;
  border-bottom:1px solid var(--bordo)}
.citarow:last-child{border-bottom:0}
.stanzaVideo{aspect-ratio:16/9;border:1px dashed var(--bordo);background:var(--nero2);
  display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}

/* ---- notifiche email (mock) e preferenze ---- */
.prefEmail{display:flex;align-items:flex-start;gap:9px;margin-top:16px;font-size:12.5px;
  color:var(--grigio2);line-height:1.5;cursor:pointer}
.prefEmail input{margin-top:3px;accent-color:var(--blu2);flex:none}
.emailBanner{position:sticky;top:62px;z-index:30;background:var(--blu);color:#fff}
.emailBannerin{display:flex;align-items:center;gap:12px;padding:10px 20px;font-size:13.5px}
.emailBannerin b{font-weight:700}
.emailBanner button{background:none;border:0;color:#fff;cursor:pointer;font:inherit}
.emailBanner .apriBanner{text-decoration:underline;font-weight:600;margin-left:auto}
.emailBanner .chiudiBanner{font-size:16px;opacity:.85;padding:0 2px}
.emailBanner .chiudiBanner:hover{opacity:1}

/* ---- provenienza nota: dal coach o salvata dalla chat (punto 4) ---- */
.origineTag{font-family:'Saira Condensed',sans-serif;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;
  border:1px solid var(--bordo);padding:2px 6px;border-radius:2px;color:var(--grigio2)}
.origineTag.coach{border-color:var(--blu2);color:var(--blu2)}

/* ---- iRating verificato/da verificare nell'identita' in header ---- */
.irTag{font-family:'Saira Condensed',sans-serif;font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;
  color:var(--oro);border:1px solid var(--oro);padding:1px 6px;border-radius:2px;margin-left:7px}
.irTag.ok{color:var(--verde);border-color:var(--verde)}

/* ---- identita' pilota, spostata nell'header accanto al logo: e' anche la
   scorciatoia per la Scheda Pilota ---- */
.identita{background:none;border:0;color:var(--grigio);cursor:pointer;font-family:'Saira Condensed',sans-serif;
  font-size:12.5px;padding:4px 0;text-align:left;white-space:nowrap}
.identita:hover{color:var(--bianco)}
.identita b{color:var(--bianco);font-weight:500}

/* ---- "con chi hai lavorato prima": impila su mobile, affianca da tablet in su (punto 3) ---- */
.storicoRiga{display:flex;flex-direction:column;gap:4px;padding:10px 0;
  border-bottom:1px solid var(--bordo);font-size:14px}
.storicoRiga:last-child{border-bottom:0}
@media(min-width:640px){.storicoRiga{flex-direction:row;justify-content:space-between;align-items:baseline;gap:14px}}

@media (prefers-reduced-motion:reduce){.crd *{transition:none!important}}
`;

/* -------------------------------- componenti -------------------------------- */

const iniz = (n) => n.split(" ").map((x) => x[0]).join("");
const perSett = (ir, gg) => Math.round((ir / gg) * 7);

// funzione identità: il parametro senza annotazione di tipo torna utile per far
// leggere/scrivere a TS un oggetto reale in uno stato inizializzato con
// useState(null), senza `as`/generici — sintassi che romperebbe il parsing di
// Babel quando questo file gira nell'artifact (solo preset "react", niente TS)
const anyOf = (x) => x;

// riga opzione con checkbox — UNICO componente riusato per fasce orarie,
// obiettivi e ogni altra lista dentro un .checkgrid (Cerca, Scheda Pilota,
// Candidatura coach). Il testo e' avvolto in uno <span> apposta: e' quello
// a cui la CSS da' flex:1 1 auto + min-width:0, cosi' e' SEMPRE il testo a
// restringersi/andare a capo, mai la casella a stirarsi per riempire lo
// spazio — la stessa regola CSS `.checkgrid input,.checkgrid label>span`
// vale per ogni chiamante, presente o futuro, senza doverla ripetere.
function OpzioneCheck({ checked, disabled = false, onChange, children }) {
  return (
    <label>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} />
      <span>{children}</span>
    </label>
  );
}

/* ---- badge "Funziona su iRacing": logo vs testo, reversibile in un colpo ----
   L'uso del logo iRacing dipende da una verifica sui termini del marchio
   ancora in corso: finché non è chiusa, deve restare un interruttore, non
   una scelta cablata nel markup. Cambiando SOLO questa variabile si torna
   al badge testuale ovunque compare, senza toccare BadgeIRacing né i punti
   che lo usano — ed è per questo che il badge è un componente unico invece
   di essere ripetuto nei vari punti dove compare. anyOf() qui (come per lo
   useState(null) altrove) serve solo a evitare che TS blocchi il confronto
   qui sotto perché "logo" da solo verrebbe letto come tipo letterale. */
const MODALITA_BADGE = anyOf("logo"); // 'logo' | 'testo'

// badge "Funziona su iRacing" — UNICO componente per ogni punto in cui il
// badge compare: cambiare MODALITA_BADGE qui sopra basta a tornare al
// testo ovunque, senza toccare i chiamanti. Il contenitore (.plat) e il
// suo ingombro restano identici nelle due modalità: cambia solo cosa c'è
// dentro. Non è un link: badge informativo, nessun onClick verso iRacing.
function BadgeIRacing() {
  if (MODALITA_BADGE === "testo")
    return <div className="plat"><i />FUNZIONA SU iRACING</div>;
  // solo il logo, senza riquadro/testo intorno — richiesto esplicitamente:
  // non è più dentro .plat (niente bordo, sfondo o padding), resta solo lo
  // spazio sotto per non far toccare il logo al titolo. Il logo è bianco:
  // lo sfondo qui è sempre scuro (vedi .crd), quindi resta leggibile.
  return <img src={LOGO_IRACING_DATAURI} alt="Funziona su iRacing" className="platLogoStandalone" />;
}

const fmtData = (iso) => {
  const s = new Date(iso + "T00:00:00").toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" });
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/* ---- forbice iRating coach ↔ allievo -----------------------------------
   Sotto i 3.000 iR dell'allievo il coach deve stare almeno il 50% sopra,
   oltre i 3.000 basta il 25%. In entrambi i casi un coach oltre il triplo
   dell'allievo è considerato troppo lontano per essere davvero utile. */

function iRAllievo(miaIr, mia) {
  const n = Number(miaIr);
  return n > 0 ? n : FASCE_MEDIO[mia];
}

// da iR verificato a fascia: stessi confini usati per etichettare FASCE
function fasciaDaIr(ir) {
  if (ir < 1500) return "b1";
  if (ir < 2500) return "b2";
  if (ir < 4000) return "b3";
  return "b4";
}

/* ---- portafoglio ore: da uno slot a una data vera --------------------
   Gli slot dei coach sono etichette tipo "Sab 30 · 10:30": solo giorno del
   mese e ora, senza mese/anno. Per calcolare la finestra di cancellazione
   (24 ore) serve una data reale, quindi si risale al mese corrente e, se
   quel giorno è già passato, al mese successivo — cosi' lo slot è sempre
   nel futuro, qualunque sia la data reale in cui gira la demo. Le
   prenotazioni del seed hanno invece data ISO + orario separati: si combinano
   direttamente, senza bisogno di indovinare nulla. */
function dataDaSlot(slot) {
  const m = slot.match(/(\d{1,2})\s*·\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const giorno = Number(m[1]), ore = Number(m[2]), minuti = Number(m[3]);
  const ora = new Date();
  let d = new Date(ora.getFullYear(), ora.getMonth(), giorno, ore, minuti, 0, 0);
  if (d.getTime() <= ora.getTime()) d = new Date(ora.getFullYear(), ora.getMonth() + 1, giorno, ore, minuti, 0, 0);
  return d;
}

function quandoSessione(p) {
  if (p.orario.includes("·")) return dataDaSlot(p.orario);
  const d = new Date(`${p.data}T${p.orario}:00`);
  return isNaN(d.getTime()) ? null : d;
}

// ore di preavviso rispetto all'inizio della sessione: se non si riesce a
// calcolarla, meglio essere generosi (rimborso) che penalizzare per un dato
// mancante che non è colpa del pilota
function oreAllaSessione(p) {
  const q = quandoSessione(p);
  if (!q) return Infinity;
  return (q.getTime() - Date.now()) / 3600000;
}

/* ---- calendario di allocazione: helper puri, riusabili sia dalla vista
   griglia (desktop) sia dalla vista agenda (mobile) ---- */

// "2026-09-05" a partire da un oggetto Date, sempre in locale (mai UTC: a
// mezzanotte UTC potrebbe gia' essere il giorno dopo/prima in Europa)
function dataIso(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), g = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${g}`;
}

// lunedi' della settimana che contiene "d" — base per la vista a griglia
function lunediDellaSettimana(d) {
  const copia = new Date(d);
  const scarto = (copia.getDay() + 6) % 7; // getDay(): 0=domenica..6=sabato -> vogliamo 0=lunedi'
  copia.setDate(copia.getDate() - scarto);
  copia.setHours(0, 0, 0, 0);
  return copia;
}

// "d" spostato di n giorni (n negativo = indietro) — passo unico sia per la
// navigazione a settimana (±7) sia a giorno singolo (±1)
function addGiorni(d, n) {
  const copia = new Date(d);
  copia.setDate(copia.getDate() + n);
  return copia;
}

// e' nel passato? confronta lo slot pieno (giorno + ora), non solo il giorno
function slotPassato(giornoJs, ora) {
  const inizio = new Date(giornoJs);
  inizio.setHours(ora, 0, 0, 0);
  return inizio.getTime() <= Date.now();
}

// occupato da una prenotazione gia' allocata con questo coach? le sessioni
// svolte/cancellate/in contestazione non bloccano lo slot: quell'ora e' di
// nuovo (o non e' mai stata) impegnata
function slotOccupato(prenotazioni, coachId, giornoIso, oraLabel) {
  return prenotazioni.some((p) =>
    p.coachId === coachId && p.stato === "allocata" &&
    (p.orario === `${giornoIso} · ${oraLabel}` || (p.data === giornoIso && p.orario === oraLabel)));
}

// annotazione "ora locale del coach" solo se il suo fuso e' diverso da
// quello mostrato al pilota — differenza di sole ore intere (vedi FUSI_OFFSET)
function oraLocaleCoach(ora, fusoCoach, fusoPilota) {
  if (fusoCoach === fusoPilota) return null;
  const diff = (FUSI_OFFSET[fusoCoach] ?? 0) - (FUSI_OFFSET[fusoPilota] ?? 0);
  const oraCoach = ((ora + diff) % 24 + 24) % 24;
  return `${String(oraCoach).padStart(2, "0")}:00`;
}

function statoForbice(coachIr, allievoIr) {
  const soglia = allievoIr <= 3000 ? allievoIr * 1.5 : allievoIr * 1.25;
  const tetto = allievoIr * 3;
  if (coachIr > tetto) return "avviso";
  if (coachIr >= soglia) return "consigliato";
  return "neutro";
}

// almeno 3 allievi in quella fascia, con guadagno positivo: il dato reale
// batte sempre l'iRating grezzo e fa salire lo stato di un gradino
function storicoBuono(coach, fascia) {
  const d = coach.fasce[fascia];
  return !!d && d[2] >= 3 && d[0] > 0;
}

const SALE_DI_GRADINO = { avviso: "neutro", neutro: "consigliato", consigliato: "consigliato" };

function calcolaStato(coach, allievoIr, mia) {
  const base = statoForbice(coach.ir, allievoIr);
  return storicoBuono(coach, mia) ? SALE_DI_GRADINO[base] : base;
}

const STATO_LABEL = { consigliato: "Consigliato", neutro: "Neutro", avviso: "Avviso" };

// la fascia in cui il coach ha il ritmo settimanale migliore, con almeno 3
// allievi: è il dato che conta di più, anche contro la sua dichiarazione
function migliorFascia(coach) {
  const candidate = FASCE
    .filter((fa) => coach.fasce[fa.k] && coach.fasce[fa.k][2] >= 3)
    .map((fa) => ({ k: fa.k, ritmo: perSett(coach.fasce[fa.k][0], coach.fasce[fa.k][1]) }));
  if (candidate.length === 0) return null;
  return candidate.reduce((a, b) => (b.ritmo > a.ritmo ? b : a)).k;
}

function fraseDichiarazione(coach) {
  const dichiarata = FASCE_FRASE[coach.fasciaDichiarata];
  const migliore = migliorFascia(coach);
  if (!migliore)
    return `Dichiara di rivolgersi a piloti ${dichiarata}, ma non ha ancora abbastanza allievi tracciati per confermarlo.`;
  if (migliore === coach.fasciaDichiarata)
    return `Dichiara di rivolgersi a piloti ${dichiarata} — e i dati lo confermano.`;
  return `Dichiara di rivolgersi a piloti ${dichiarata}, ma i risultati migliori li ottiene con piloti ${FASCE_FRASE[migliore]}.`;
}

function Media({ id, ratio = "16 / 9", nota, tipo = "video" }) {
  const src = MEDIA[id];
  if (src)
    return (
      <div className="media" style={{ aspectRatio: ratio }}>
        {tipo === "video" ? (
          <video src={src} autoPlay muted loop playsInline />
        ) : (
          <img src={src} alt={nota || ""} />
        )}
      </div>
    );
  return (
    <div className="slot" style={{ aspectRatio: ratio }}>
      <code>{id}</code>
      <p>{nota}</p>
      <span>{tipo === "video" ? "Video in loop" : "Immagine"} · {ratio.replace(" ", "")}</span>
    </div>
  );
}

function Spark({ curva, start, w = 110, h = 36 }) {
  const min = Math.min(...curva), max = Math.max(...curva);
  const pts = curva.map((v, i) => {
    const x = (i / (curva.length - 1)) * w;
    const y = h - 3 - ((v - min) / (max - min || 1)) * (h - 7);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const sx = ((start / (curva.length - 1)) * w).toFixed(1);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Andamento iRating allievi"
         style={{ marginLeft: "auto", flex: "none" }}>
      {/* colori dal tema corrente (var(--...)), non esadecimali fissi: prima
         sfasavano rispetto al resto della pagina a ogni cambio di identità
         visiva — il marcatore è neutro (--grigio), il "prima" è muto
         (--grigio2), il "dopo" è il colore del dato verificato (--blu2) */}
      <line x1={sx} y1="0" x2={sx} y2={h} stroke="var(--grigio)" strokeWidth="1" strokeDasharray="2 2" />
      <polyline points={pts.slice(0, start + 1).join(" ")} fill="none" stroke="var(--grigio2)" strokeWidth="1.5" />
      <polyline points={pts.slice(start).join(" ")} fill="none" stroke="var(--blu2)" strokeWidth="2" />
    </svg>
  );
}

/* ---- il momento firma di "La traiettoria", esteso (giro 4) ----------------
   Non più un tratto isolato nell'hero: UN SOLO percorso SVG continuo che
   attraversa hero + fascia numeri + "come funziona", con i tre passaggi
   agganciati a punti precisi lungo la curva. Un solo <svg>, non uno per
   sezione — i "salti" fra pezzi separati sarebbero l'errore più visibile.

   Architettura, in breve:
   - PistaContinua possiede l'unico <svg> (tre copie sovrapposte dello
     STESSO <path> — asfalto largo, bordo chiaro sotto, cordolo a strisce
     solo vicino all'apice — così avanzano insieme per costruzione, non
     per sincronizzazione manuale) e riceve dall'esterno i ref dei tre
     blocchi ".passo": è l'unico punto che legge lo scroll, quindi è anche
     l'unico punto che deve scrivere sia sull'SVG sia sui tre blocchi.
   - Il progresso è UNA lettura dal vivo dello scroll (rAF-throttled), non
     un'animazione a durata fissa: si scrolla, la linea avanza; si torna
     indietro, si ritira. Stessa logica per i tre blocchi, calcolata dalla
     LORO posizione nel viewport (non dalla lunghezza percorsa sul path:
     più robusta, non richiede far coincidere esattamente la geometria
     della curva con l'impaginazione reale) — la luce sul nodo segue lo
     stesso trigger del blocco a cui appartiene, quindi restano coerenti
     anche se il calcolo è per due vie diverse.
   - Stato di partenza SEMPRE corretto senza JS: l'SVG è disegnato per
     intero (nessun dasharray in JSX) e i blocchi sono nella loro
     posizione naturale (nessun transform in JSX) — l'effect, quando può
     partire, li porta temporaneamente allo stato "non ancora rivelato"
     e da lì li riporta indietro seguendo lo scroll. Se prefers-reduced-
     motion è attivo, l'effect non parte mai: resta la versione già
     corretta e ferma vista dal primissimo render.
   - Solo transform/opacity per i blocchi; per l'SVG, stroke-dashoffset
     (nessun ricalcolo di layout, stessa classe di costo di opacity — vedi
     nota nel giro precedente). Tutto scritto via ref, mai via setState:
     un aggiornamento di stile diretto per frame, senza far ripassare
     l'intero albero React ad ogni scroll. */
/* Tornante vero, non un arco generico: entra largo da sinistra (vicino al
   logo), spazza largo sul video dell'hero, si stringe di scatto verso
   l'apice — allineato alla CTA "Cerco un coach" — e riapre uscendo verso
   il basso. Da lì attraversa la fascia numeri (nascosta sotto, invariata)
   e prosegue nei tre passaggi restando DENTRO al corridoio fra le due
   colonne (testo/video) di CIASCUN passo per l'intera sua altezza, non
   solo di sfuggita: la versione precedente sceglieva un punto qualunque
   lungo una curva ad ampie escursioni, che poteva cadere (e cadeva)
   dentro al riquadro video invece che nel corridoio — bug #2 di questo
   giro, il nodo restava acceso ma dentro a un riquadro con sfondo opaco,
   invisibile. Qui invece ogni "rientro" del serpente è tarato sul
   corridoio REALE di quel passo (~42% di larghezza per 01/03, media a
   sinistra; ~58% per 02, inverso, media a destra — la stessa alternanza
   sinistra/destra/sinistra viene per costruzione dai due layout). viewBox
   0 0 100 1000: x in percentuale di larghezza, y in millesimi dell'altezza
   reale della zona (hero+numeri+come funziona) — la stessa scala per
   qualunque contenitore, per costruzione, perché preserveAspectRatio="none"
   la stira in modo lineare in verticale. */
const PISTA_PATH_D =
  "M 10 0 C 22.5 21.7, 85.0 97.5, 85 130 " +
  "C 70.0 150.0, 20.0 175.0, 10 195 " +
  "C 4.0 215.0, 20.0 270.0, 42 300 " +
  "C 51.0 332.5, 63.8 366.2, 64 390 " +
  "C 64.2 413.8, 46.8 421.3, 43 443 " +
  "C 39.2 464.7, 41.0 494.3, 41 520 " +
  "C 41.0 545.7, 41.3 578.7, 43 597 " +
  "C 44.7 615.3, 48.5 611.8, 51 630 " +
  "C 53.5 648.2, 57.2 680.5, 58 706 " +
  "C 58.8 731.5, 58.3 764.7, 56 783 " +
  "C 53.7 801.3, 46.3 797.7, 44 816 " +
  "C 41.7 834.3, 41.7 867.5, 42 893 " +
  "C 42.3 918.5, 45.3 951.2, 46 969 " +
  "C 46.7 986.8, 46.0 994.8, 46 1000";
/* frazioni di lunghezza d'arco (0→1 sull'intero PISTA_PATH_D) di ogni
   punto notevole — calcolate campionando la curva, non a occhio (script
   in scratchpad, riportato qui perché la geometria sopra è quella
   verificata a occhio in browser, inclusa la posizione reale dei riquadri
   video via getBoundingClientRect). Un solo sistema di riferimento per
   tutto: dove finisce il disegno progressivo (dashoffset) E dove si
   accende ogni nodo/blocco E dove si accende il cordolo sono la STESSA
   frazione, mai calcoli indipendenti — era esattamente il bug #1 di
   questo giro (il nodo si accendeva secondo la posizione reale del
   blocco in pagina, la linea secondo tutt'altra formula: non erano MAI
   garantite di coincidere, il nodo restava acceso senza traccia). */
const PISTA_APICE_INIZIO = 0.17; // poco prima di P2 (0.2336): il cordolo si accende qui
const PISTA_APICE_FINE = 0.29; // poco dopo P2: il cordolo si spegne qui, resta solo la fascia
// ogni ancora e' il CENTRO verticale del passo corrispondente, con la x
// del punto della curva in quel punto già dentro al corridoio fra le due
// colonne (non nel riquadro video) — vedi il commento sopra
const PISTA_ANCORE = [0.520, 0.706, 0.893]; // nodo1/passo1, nodo2/passo2, nodo3/passo3
const PISTA_FINESTRA = 0.10; // ampiezza della transizione (in frazione di progresso) prima di ogni ancora

// cerca il punto della curva alla coordinata y desiderata (0-1000): la
// curva e' monotona crescente in y per costruzione (nessun controllo
// punto ha una y minore del precedente), quindi una scansione lineare
// basta ed e' sempre stabile — piu' robusto che assumere che la frazione
// di LUNGHEZZA D'ARCO coincida con la frazione di y (non coincide: il
// tornante dell'hero percorre piu' strada orizzontale che verticale)
function trovaPuntoPerY(path, L, targetY, campioni) {
  let punto = path.getPointAtLength(0);
  for (let i = 0; i <= campioni; i++) {
    const p = path.getPointAtLength((i / campioni) * L);
    punto = p;
    if (p.y >= targetY) break;
  }
  return punto;
}

function PistaContinua({ passoRefs, children }) {
  const rifSvg = React.useRef(anyOf(null));
  const rifZona = React.useRef(anyOf(null));
  const [nodi, setNodi] = useState(anyOf([]));
  const [tacche, setTacche] = useState(anyOf([]));

  // geometria di nodi e tacche: calcolata dal <path> reale, non indovinata
  // a mano — ricalcolata anche al resize, perché le tacche del cordolo
  // devono restare perpendicolari ALLO SCHERMO (vedi sotto) e lo schermo
  // cambia proporzioni.
  useEffect(() => {
    function calcola() {
      const svg = rifSvg.current;
      const path = svg && svg.querySelector(".pistaLayer");
      if (!path || typeof window === "undefined") return;
      const L = path.getTotalLength();
      setNodi(PISTA_ANCORE.map((f) => trovaPuntoPerY(path, L, f * 1000, 400)));

      // tacche del cordolo, perpendicolari alla direzione di marcia SULLO
      // SCHERMO — non nello spazio interno del viewBox. Il viewBox è
      // deformato apposta (preserveAspectRatio="none", per adattarsi a
      // contenitori di proporzioni molto diverse), quindi un angolo
      // corretto nello spazio sorgente esce storto una volta stirato: la
      // versione precedente lo ignorava e rinunciava a tacche vere
      // (tratteggio parallelo alla curva, dichiarato come ripiego). Qui si
      // calcola il fattore di scala reale (sx,sy = pixel schermo per unità
      // di viewBox) dal bounding box dell'svg, si porta la tangente in
      // spazio schermo, la si ruota di 90°, e si riporta la direzione
      // risultante nello spazio del viewBox DIVIDENDO per lo stesso
      // fattore — cosicché quando l'SVG la ristira, torni perpendicolare
      // per davvero sullo schermo. Le tacche campionano DIRETTAMENTE il
      // path principale (tra PISTA_APICE_INIZIO e _FINE), non una copia
      // separata: allineamento perfetto con la fascia d'asfalto per
      // costruzione, mai da tenere sincronizzato a mano.
      const rect = svg.getBoundingClientRect();
      const sx = rect.width / 100;
      const sy = rect.height / 1000;
      if (!sx || !sy) return;
      const nTacche = 9;
      // lunghezza della tacca in pixel schermo reali, non in unità di
      // viewBox: dipende dalla LARGHEZZA della zona (rect.height è
      // l'altezza di tutta la zona hero+numeri+passaggi, enorme e non
      // pertinente qui), clampata a un intervallo leggibile su ogni schermo
      const lunghezzaSchermo = Math.max(14, Math.min(26, rect.width * 0.022));
      const nuove = anyOf([]);
      for (let i = 0; i < nTacche; i++) {
        const t = PISTA_APICE_INIZIO + ((i + 0.5) / nTacche) * (PISTA_APICE_FINE - PISTA_APICE_INIZIO);
        const p = path.getPointAtLength(t * L);
        const p2 = path.getPointAtLength(Math.min(L, t * L + 0.5));
        const dx = p2.x - p.x, dy = p2.y - p.y;
        const tsx = dx * sx, tsy = dy * sy; // tangente in spazio schermo
        const tl = Math.hypot(tsx, tsy) || 1;
        const perpSx = -tsy / tl, perpSy = tsx / tl; // perpendicolare, spazio schermo, unitaria
        // riportata nello spazio del viewBox e scalata alla lunghezza voluta
        const vx = (perpSx / sx) * lunghezzaSchermo;
        const vy = (perpSy / sy) * lunghezzaSchermo;
        nuove.push({
          x1: p.x - vx / 2, y1: p.y - vy / 2,
          x2: p.x + vx / 2, y2: p.y + vy / 2,
          tinta: i % 2 === 0 ? "a" : "b",
        });
      }
      setTacche(nuove);
    }
    calcola();
    let t;
    function onResize() { clearTimeout(t); t = setTimeout(calcola, 120); }
    window.addEventListener("resize", onResize);
    return () => { clearTimeout(t); window.removeEventListener("resize", onResize); };
  }, []);

  useEffect(() => {
    const svg = rifSvg.current;
    const zona = rifZona.current;
    if (!svg || !zona) return;
    if (typeof window === "undefined") return;
    const riduciMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (riduciMotion) return; // resta lo stato di partenza: tutto già disegnato/in posizione

    const clipRect = svg.querySelector(".pistaClipRect");
    const cordoloEl = svg.querySelector(".pistaCordoloGruppo");
    const nodiEl = svg.querySelectorAll(".pistaNodo");
    const blocchi = passoRefs.map((r) => r.current).filter(Boolean);
    if (!clipRect || !blocchi.length) return;

    clipRect.setAttribute("height", "0");
    if (cordoloEl) cordoloEl.style.opacity = "0";
    nodiEl.forEach((n) => { n.style.opacity = ".35"; n.style.transform = "scale(.7)"; });

    const larghezzaSpostamento = window.innerWidth < 640 ? 40 : 70;
    const direzioni = [-1, 1, -1]; // 01 da sinistra, 02 da destra, 03 da sinistra
    blocchi.forEach((b, i) => {
      b.style.transform = `translateX(${direzioni[i] * larghezzaSpostamento}px)`;
      b.style.opacity = "0";
    });

    let ticking = false;
    let attivo = true;

    function aggiorna() {
      if (!attivo) return;
      ticking = false;
      const rect = zona.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quando l'inizio della zona tocca il fondo del viewport, 1 quando
      // la fine della zona ha superato la cima: il percorso avanza per
      // tutta l'estensione di hero+numeri+come-funziona, reversibile
      const progresso = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
      // rivelazione via ritaglio (un <rect> che cresce in altezza dentro un
      // <clipPath>), NON piu' stroke-dasharray/dashoffset: con
      // vector-effect="non-scaling-stroke" (necessario per uno spessore
      // costante sotto lo stiramento non uniforme del viewBox, vedi sopra)
      // il tratteggio veniva disegnato in un punto sbagliato della curva —
      // un bug del motore di rendering sotto stiramento cosi' estremo (12x
      // in larghezza contro 2x in altezza), verificato isolando le due
      // proprietà una alla volta. Il ritaglio e' immune: agisce PRIMA dello
      // stiramento, nello stesso spazio del path, e resta corretto qualunque
      // sia il rapporto fra i due assi.
      clipRect.setAttribute("height", `${progresso * 1000}`);
      if (cordoloEl) {
        // il cordolo (tornante dell'hero, y 110→300 su 1000) si accende
        // gradualmente MENTRE il disegno progressivo attraversa proprio
        // quel tratto — stessa fonte "progresso" del dashoffset, non una
        // soglia indipendente
        const cordoloIn = Math.min(1, Math.max(0, (progresso - PISTA_APICE_INIZIO) / (PISTA_APICE_FINE - PISTA_APICE_INIZIO)));
        cordoloEl.style.opacity = `${cordoloIn}`;
      }

      // Un solo valore — lo stesso "progresso" che pilota il dashoffset —
      // decide anche quando ogni blocco entra e quando il suo nodo si
      // accende: la linea disegnata e il blocco raggiungono lo stesso
      // punto ESATTAMENTE nello stesso istante, per costruzione, non per
      // coincidenza fra due formule diverse (era il bug: il nodo usava la
      // propria posizione reale in pagina, la linea la propria — niente
      // le teneva sincronizzate, e il nodo restava acceso senza traccia).
      blocchi.forEach((b, i) => {
        const soglia = PISTA_ANCORE[i];
        const locale = Math.min(1, Math.max(0, (progresso - (soglia - PISTA_FINESTRA)) / PISTA_FINESTRA));
        b.style.transform = `translateX(${direzioni[i] * larghezzaSpostamento * (1 - locale)}px)`;
        b.style.opacity = `${locale}`;
        const nodo = nodiEl[i];
        if (nodo) {
          // il nodo e' fermo esattamente sul punto del path a frazione
          // "soglia" (vedi PISTA_ANCORE): scatta acceso solo a fine
          // transizione (locale vicino a 1), quando "progresso" ha
          // raggiunto quella stessa frazione — cioe' quando il disegno
          // progressivo (dashoffset) e' arrivato DAVVERO fin li'. Farlo
          // scattare prima (a inizio transizione) lo accenderebbe mentre
          // la linea è ancora visibilmente lontana da quel punto.
          const acceso = locale > 0.85;
          nodo.style.opacity = acceso ? "1" : ".35";
          nodo.style.transform = `scale(${acceso ? 1 : 0.7})`;
        }
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(aggiorna);
    }

    aggiorna();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      attivo = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [passoRefs]);

  const idClip = React.useId();
  return (
    <div ref={rifZona} className="pistaZona">
      <svg ref={rifSvg} className="pistaSvg" viewBox="0 0 100 1000" preserveAspectRatio="none"
           aria-hidden="true" focusable="false">
        <defs>
          {/* il ritaglio che disegna progressivamente la pista: un <rect>
             che cresce in altezza da 0 a 1000 (l'intero viewBox) via ref,
             mai via stroke-dasharray/dashoffset — vedi il commento nello
             scroll-effect sul perché quella tecnica va evitata qui */}
          <clipPath id={idClip} clipPathUnits="userSpaceOnUse">
            <rect className="pistaClipRect" x="0" y="0" width="100" height="1000" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${idClip})`}>
          {/* bordo/track-limits: stroke piu' chiaro e piu' largo SOTTO,
             l'asfalto piu' scuro e piu' stretto SOPRA lascia visibile solo
             un margine ai due lati — parallelo per costruzione lungo
             qualunque curva, senza calcolare un offset geometrico vero */}
          <path className="pistaLayer pistaBordo" d={PISTA_PATH_D} fill="none" strokeLinecap="round" />
          <path className="pistaLayer pistaAsfalto" d={PISTA_PATH_D} fill="none" strokeLinecap="round" />
          <g className="pistaCordoloGruppo">
            {tacche.map((t, i) => (
              <line key={i} className="pistaTacca" data-tinta={t.tinta}
                    x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
        </g>
        {/* i nodi restano FUORI dal ritaglio: si accendono/spengono via
           opacity (vedi lo scroll-effect), non seguono il bordo del
           ritaglio — un segmento di lunghezza zero con stroke-linecap:round
           e non-scaling-stroke disegna un punto di diametro costante in
           pixel reali — un <circle> col solo raggio si sarebbe deformato
           in un'ellisse, perché il viewBox è deformato apposta
           (preserveAspectRatio="none") per adattarsi a container di
           proporzioni diverse */}
        {nodi.map((n, i) => (
          <line key={i} className="pistaNodo" x1={n.x} y1={n.y} x2={n.x} y2={n.y} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {children}
    </div>
  );
}

/* ---------------------------------- HOME ---------------------------------- */

function Home({ vaiLogin, vaiCandidatura }) {
  // tre ref, non tre stati: PistaContinua legge e scrive direttamente su
  // questi nodi a ogni frame di scroll, senza passare da un re-render di
  // Home — vedi il commento su PistaContinua per il perché
  const passo1 = React.useRef(anyOf(null));
  const passo2 = React.useRef(anyOf(null));
  const passo3 = React.useRef(anyOf(null));
  const passoRefs = anyOf([passo1, passo2, passo3]);

  return (
    <>
      {/* PistaContinua avvolge hero + fascia numeri + "come funziona": UN
         SOLO <svg> dietro alle tre sezioni, non uno per blocco — i "salti"
         fra pezzi separati sarebbero l'errore più visibile. Dove il
         percorso passa sotto alla fascia numeri (che ha già un fondo
         opaco, invariata) semplicemente sparisce e riappare dopo, come
         una pista che passa sotto un cavalcavia: nessuna modifica a
         quella sezione. */}
      <PistaContinua passoRefs={passoRefs}>
        {/* HERO — asimmetrico apposta: il testo pesa a sinistra, il video è
            più stretto e più basso, la traiettoria attraversa lo spazio fra
            i due invece di lasciarlo vuoto. Entra largo (badge+titolo),
            stringe verso l'apice (il cordolo, il titolo si scala riga dopo
            riga), esce largo di nuovo nella fascia numeri sotto. */}
        <section className="hero">
          <div className="w herogrid">
            <div className="heroTesto">
              <BadgeIRacing />
              <h1 className="h1">
                <span className="h1riga">Trova il coach</span>
                <span className="h1riga">che ti fa salire</span>
                <span className="h1riga"><em>davvero.</em></span>
              </h1>
              <p className="lead">
                Su CORDA ogni coach è valutato con un solo numero: l'iRating che i suoi allievi hanno
                guadagnato dopo la prima sessione. Il dato arriva dall'account iRacing dell'allievo,
                non da una recensione.
              </p>
              <div className="ctas">
                <button className="b b-blu b-lg" onClick={() => vaiLogin("pilota")}>
                  Cerco un coach
                </button>
                <button className="b b-ghost b-lg" onClick={vaiCandidatura}>
                  Voglio fare coaching
                </button>
              </div>
            </div>
            <div className="heroMedia">
              <Media id="V01" ratio="16 / 10"
                     nota="Onboard iRacing, loop breve senza audio. È la prima cosa che si vede: meglio una staccata pulita che un montaggio." />
            </div>
          </div>
        </section>

        {/* NUMERI */}
        <section className="band">
          <div className="w">
            <div className="bandin">
              <div className="bcell"><b>18</b><span>coach verificati</span></div>
              <div className="bcell"><b>+412</b><span>iR mediani per allievo</span></div>
              <div className="bcell"><b>30 gg</b><span>tempo mediano</span></div>
              <div className="bcell"><b>iRacing</b><span>unica piattaforma supportata</span></div>
            </div>
          </div>
        </section>

        {/* COME FUNZIONA — i tre passaggi sono in fila, non più affiancati:
           è la sequenza in cui la traiettoria li raggiunge scendendo, non
           un layout scelto per stile. Ognuno alterna testo/video (e il
           lato da cui "entra" scorrendo): 01 da sinistra, 02 da destra,
           03 da sinistra — la stessa alternanza della curva sopra. */}
        <section className="sez" id="come">
          <div className="w">
            <div className="sezhead">
              <div className="eyebrow">Come funziona</div>
              <h2 className="h2">Tre passaggi, nessuna sorpresa.</h2>
              <p className="p">
                Colleghi il tuo account iRacing una volta sola. Da lì in poi la piattaforma sa da dove
                parti e misura dove arrivi.
              </p>
            </div>

            <div className="passi">
              <div className="passo" ref={passo1}>
                <div className="passoMedia">
                  <Media id="V02" ratio="4 / 3" nota="Schermata di ricerca coach, con i filtri che si muovono." />
                </div>
                <div className="passoTesto">
                  <div className="num">01</div>
                  <h3>Dici da dove parti</h3>
                  <p>
                    Categoria, vettura, obiettivo e il tuo iRating attuale. Ti mostriamo solo i coach
                    che hanno risultati con piloti della tua fascia, non i più veloci in assoluto.
                  </p>
                </div>
              </div>
              <div className="passo passoInverso" ref={passo2}>
                <div className="passoMedia">
                  <Media id="V03" ratio="4 / 3" nota="Sessione live: schermo del coach con telemetria e onboard dell'allievo." />
                </div>
                <div className="passoTesto">
                  <div className="num">02</div>
                  <h3>Guidi con il coach</h3>
                  <p>
                    Sessione da un'ora in pista insieme. Il pagamento resta in deposito fino a 24 ore
                    dopo: se il coach non si presenta, torna a te.
                  </p>
                </div>
              </div>
              <div className="passo" ref={passo3}>
                <div className="passoMedia">
                  <Media id="V04" ratio="4 / 3" nota="Curva iRating che sale, con il marcatore della prima sessione." />
                </div>
                <div className="passoTesto">
                  <div className="num">03</div>
                  <h3>Vedi se è servito</h3>
                  <p>
                    Corri le tue gare normalmente. La piattaforma confronta la tua curva iRating con i
                    trenta giorni precedenti e dice se il lavoro ha funzionato.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PistaContinua>

      {/* IL NUMERO */}
      <section className="sez">
        <div className="w duo">
          <div>
            <div className="eyebrow">Il numero che conta</div>
            <h2 className="h2">Le stelline non fanno guadagnare iRating.</h2>
            <p className="p">
              Chiunque può avere cinque stelle. Molto più difficile è far salire chi si allena con te,
              e dimostrarlo con i dati di iRacing.
            </p>
            <ul className="check">
              <li>Solo allievi che hanno collegato l'account e dato il consenso.</li>
              <li>Minimo otto gare dopo la prima sessione: chi non corre non entra nel conto.</li>
              <li>Mediana e non media, così un allievo fuoriclasse non gonfia il risultato.</li>
              <li>Normalizzato per fascia: salire da 1.200 non vale quanto salire da 5.000.</li>
              <li>Finestra mobile di 90 giorni: chi smette di funzionare scende.</li>
            </ul>
          </div>
          <div className="metric">
            <div className="eyebrow">Esempio reale di un allievo</div>
            <div className="big numero-eroe" style={{ marginTop: 14 }}>+564 iR</div>
            <div className="sm">in 22 giorni · 179 iR a settimana · 19 gare</div>
            <div style={{ marginTop: 20 }}>
              <Media id="I01" ratio="4 / 3" tipo="immagine"
                     nota="Postazione di un coach o schermata del profilo con la curva iRating." />
            </div>
          </div>
        </div>
      </section>

      {/* DUE PORTE */}
      <section className="sez">
        <div className="w">
          <div className="sezhead">
            <div className="eyebrow">Da che parte stai</div>
            <h2 className="h2">Due ingressi, due mestieri diversi.</h2>
          </div>
          <div className="due">
            <div className="porta blu">
              <h3>Sono un pilota</h3>
              <p>
                Cerchi qualcuno che ti tolga il tempo o ti faccia smettere di rovinare le gare.
                Scegli in base ai risultati ottenuti con piloti che partivano dal tuo livello, non
                in base a chi ha il canale YouTube più grosso.
              </p>
              <button className="b b-blu" onClick={() => vaiLogin("pilota")}>Entra come pilota</button>
            </div>
            <div className="porta rossa">
              <h3>Sono un coach</h3>
              <p>
                Hai già allievi su Discord e li gestisci a mano. Qui hai calendario, pagamenti,
                fatture e uno storico dei risultati che vale più di qualsiasi presentazione. La
                commissione è il 15%.
              </p>
              <button className="b b-rosso" onClick={vaiCandidatura}>Candidati come coach</button>
            </div>
          </div>
        </div>
      </section>

      {/* CHIUSURA */}
      <section className="sez">
        <div className="w duo">
          <Media id="V05" ratio="16 / 9" nota="Montaggio lungo di gare e sorpassi, loop di sfondo per la chiusura." />
          <div>
            <div className="eyebrow">Oggi</div>
            <h2 className="h2">Partiamo da iRacing.</h2>
            <p className="p">
              Una sola piattaforma, tutte le sue categorie: gran turismo, prototipi, monoposto,
              ovali. Coach scelti a mano, nessun profilo finto. Gli altri simulatori arrivano
              quando qui il sistema funziona davvero.
            </p>
            <div className="ctas" style={{ marginTop: 26 }}>
              <button className="b b-blu b-lg" onClick={() => vaiLogin("pilota")}>Inizia ora</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sez">
        <div className="w">
          <div className="sezhead">
            <div className="eyebrow">Domande</div>
            <h2 className="h2">Quello che chiedono tutti.</h2>
          </div>
          <div className="faq">
            <details>
              <summary>Serve per forza collegare l'account iRacing?</summary>
              <p>
                Per prenotare no, per contare nei risultati sì. Senza collegamento la tua crescita
                non viene misurata e non finisce nel punteggio del coach.
              </p>
            </details>
            <details>
              <summary>E se il coach non si presenta?</summary>
              <p>
                Il pagamento resta in deposito fino a 24 ore dopo la sessione. Se non si presenta,
                l'importo torna a te automaticamente.
              </p>
            </details>
            <details>
              <summary>Come faccio a sapere che i numeri sono veri?</summary>
              <p>
                Arrivano dall'account iRacing degli allievi, non da quello del coach. Il coach può
                leggerli, non modificarli.
              </p>
            </details>
            <details>
              <summary>Funziona anche su altri simulatori?</summary>
              <p>
                Al momento no. CORDA lavora solo su iRacing, perché è l'unico dove esiste un dato
                pubblico e confrontabile su cui misurare il progresso.
              </p>
            </details>
          </div>
        </div>
      </section>

      <footer className="w foot">
        <div className="footgrid">
          <div>
            <div className="brand" style={{ cursor: "default", marginBottom: 10 }}>CORD<i>A</i></div>
            <div>Coaching per iRacing.<br />Demo — dati inventati, nessun pagamento reale.</div>
          </div>
          <div className="mn" style={{ fontSize: 11.5, letterSpacing: ".08em", lineHeight: 2 }}>
            SLOT MEDIA DA CARICARE<br />
            V01 hero · V02 ricerca · V03 sessione<br />
            V04 curva iRating · I01 profilo · V05 chiusura
          </div>
        </div>
      </footer>
    </>
  );
}

/* ---------------------------------- LOGIN ---------------------------------- */

function Login({ ruolo, setRuolo, entra }) {
  return (
    <div className="auth">
      <div className="authbox">
        <div className="eyebrow">Accedi a CORDA</div>
        <h2 style={{ fontSize: 26, marginTop: 10 }}>
          {ruolo === "coach" ? "Area coach" : "Area pilota"}
        </h2>

        <div className="tabs">
          {["pilota", "coach"].map((r) => (
            <button key={r} data-r={r} data-on={ruolo === r ? "1" : "0"} onClick={() => setRuolo(r)}>
              {r === "pilota" ? "Sono un pilota" : "Sono un coach"}
            </button>
          ))}
        </div>

        <div className="campo">
          <label htmlFor="em">Email</label>
          <input id="em" type="email" placeholder="nome@email.it" defaultValue="" />
        </div>
        <div className="campo">
          <label htmlFor="pw">Password</label>
          <input id="pw" type="password" placeholder="••••••••" defaultValue="" />
        </div>

        <button className={ruolo === "coach" ? "b b-rosso b-lg" : "b b-blu b-lg"}
                style={{ width: "100%", marginTop: 8 }} onClick={entra}>
          Entra
        </button>

        <div className="hintbox">
          {ruolo === "coach"
            ? "Al primo accesso ti chiediamo di collegare l'account iRacing per verificare licenza e iRating. Senza verifica il profilo non è pubblicabile."
            : "Al primo accesso colleghiamo il tuo account iRacing e congeliamo il tuo iRating come punto zero. È da lì che si misura tutto quello che viene dopo."}
        </div>
        <div style={{ marginTop: 16, fontSize: 12.5, color: "var(--grigio2)" }}>
          Demo: premi Entra, non serve nessuna credenziale.
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- AREA PILOTA ------------------------------- */

function Cerca({ apri, mia, miaIr, iracingCollegato, setIracingCollegato }) {
  const [cat, setCat] = useState("tutte");
  const [auto, setAuto] = useState(TUTTE);
  const [obi, setObi] = useState(OBIETTIVI.map((o) => o.k).slice(0, 0));
  const [prezzoMin, setPrezzoMin] = useState(PREZZO_MIN);
  const [prezzoMax, setPrezzoMax] = useState(PREZZO_MAX);

  const cambiaCat = (k) => { setCat(k); setAuto(TUTTE); };

  const cambiaPrezzoMin = (v) => setPrezzoMin(Math.min(v, prezzoMax - 1));
  const cambiaPrezzoMax = (v) => setPrezzoMax(Math.max(v, prezzoMin + 1));
  const pctPrezzo = (v) => ((v - PREZZO_MIN) / (PREZZO_MAX - PREZZO_MIN)) * 100;

  const toggleObi = (k) =>
    setObi((prev) => {
      if (prev.includes(k)) return prev.filter((x) => x !== k);
      if (prev.length >= MAX_OBIETTIVI) return prev;
      return [...prev, k];
    });

  const allievoIr = iRAllievo(miaIr, mia);

  const list = [...COACHES]
    .filter((c) => (cat === "tutte" || c.cat.includes(cat)) &&
                   (auto === TUTTE || c.auto.includes(auto)) &&
                   (obi.length === 0 || obi.some((o) => c.obiettivi.includes(o))) &&
                   (c.prezzo >= prezzoMin && c.prezzo <= prezzoMax))
    .sort((a, b) => {
      // senza iR verificato non c'e' una fascia reale su cui ordinare: niente
      // di meglio da fare che lasciare l'ordine invariato, invece di ordinare
      // su una fascia assunta
      if (!iracingCollegato) return 0;
      const fa = a.fasce[mia], fb = b.fasce[mia];
      if (fa && !fb) return -1;
      if (!fa && fb) return 1;
      if (fa && fb) return perSett(fb[0], fb[1]) - perSett(fa[0], fa[1]);
      return 0;
    });

  // coach della stessa categoria, in stato Consigliato: l'alternativa da
  // proporre quando un altro coach è troppo lontano dal livello del pilota
  const alternative = (c) =>
    COACHES.filter((x) => x.id !== c.id &&
      x.cat.some((k) => c.cat.includes(k)) &&
      calcolaStato(x, allievoIr, mia) === "consigliato").slice(0, 3);

  return (
    <div className="w">
      <div className="stit" style={{ marginTop: 26 }}>
        <span>Trova il tuo coach</span><span>{list.length} risultati</span>
      </div>

      {!iracingCollegato && (
        <div className="lockbox" style={{ marginBottom: 20 }}>
          <div className="eyebrow">iRating non ancora verificato</div>
          <p style={{ marginTop: 10, color: "var(--grigio)", fontSize: 14.5, lineHeight: 1.6 }}>
            Collega iRacing per vedere i coach giusti per la tua fascia. Puoi comunque guardarti
            intorno: gli stati Consigliato/Neutro/Avviso restano spenti finché l'account non è
            collegato.
          </p>
          <button className="b b-blu" style={{ marginTop: 14 }} onClick={() => setIracingCollegato?.(true)}>
            Collega il tuo account iRacing
          </button>
        </div>
      )}

      <div className="filtri">
        <div className="fhead"><span>Filtri</span><span>Dati da iRacing</span></div>
        <div className="frow">
          <label htmlFor="f0">Categoria</label>
          <select id="f0" value={cat} onChange={(e) => cambiaCat(e.target.value)}>
            {CATEGORIE.map((k) => <option key={k.k} value={k.k}>{k.l}</option>)}
          </select>
        </div>
        <div className="frow">
          <label htmlFor="f2">Vettura</label>
          <select id="f2" value={auto} onChange={(e) => setAuto(e.target.value)}>
            <option>{TUTTE}</option>
            {gruppiDi(cat).map(([nome, vetture], i) => (
              <optgroup label={nome} key={`${nome}-${i}`}>
                {vetture.map((a) => <option key={a}>{a}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="frow" style={{ alignItems: "flex-start" }}>
          <label htmlFor="f3">Obiettivo</label>
          <div style={{ flex: 1 }}>
            <div className="checkgrid" id="f3">
              {OBIETTIVI.map((o) => {
                const on = obi.includes(o.k);
                return (
                  <OpzioneCheck key={o.k} checked={on} disabled={!on && obi.length >= MAX_OBIETTIVI}
                                onChange={() => toggleObi(o.k)}>
                    {o.l}
                  </OpzioneCheck>
                );
              })}
            </div>
            <p className="nn" style={{ marginTop: 8 }}>
              {obi.length === 0 ? `Nessuno selezionato · fino a ${MAX_OBIETTIVI}` : `${obi.length}/${MAX_OBIETTIVI} selezionati`}
            </p>
          </div>
        </div>
        <div className="frow" style={{ alignItems: "flex-start" }}>
          <label htmlFor="f4">Prezzo /h</label>
          <div style={{ flex: 1 }}>
            <div className="rangewrap" id="f4">
              <div className="rangetrack" />
              <div className="rangefill" style={{ left: `${pctPrezzo(prezzoMin)}%`, right: `${100 - pctPrezzo(prezzoMax)}%` }} />
              <input type="range" min={PREZZO_MIN} max={PREZZO_MAX} step="0.01" value={prezzoMin}
                     aria-label="Prezzo minimo" onChange={(e) => cambiaPrezzoMin(Number(e.target.value))} />
              <input type="range" min={PREZZO_MIN} max={PREZZO_MAX} step="0.01" value={prezzoMax}
                     aria-label="Prezzo massimo" onChange={(e) => cambiaPrezzoMax(Number(e.target.value))} />
            </div>
            <p className="nn" style={{ marginTop: 6 }}>
              {prezzoMin.toFixed(2)}€ – {prezzoMax.toFixed(2)}€ /h
            </p>
          </div>
        </div>
      </div>

      <p className="nota" style={{ marginTop: 0 }}>
        {iracingCollegato
          ? "L'ordine cambia con la tua fascia: chi fa numeri enormi con i principianti non è detto che li faccia con te. Consigliato / Neutro / Avviso confrontano il tuo iR con quello del coach."
          : "Consigliato / Neutro / Avviso confrontano il tuo iR con quello del coach: collega l'account per vederli."}
      </p>

      <div className="lista">
        {list.map((c) => {
          const f = iracingCollegato ? c.fasce[mia] : undefined;
          const stato = iracingCollegato ? calcolaStato(c, allievoIr, mia) : "neutro";
          return (
            <div key={c.id}>
              <button className="cc" onClick={() => apri(c)}>
                <div className="cctop">
                  <div className="avat">{iniz(c.nome)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ccnome">{c.nome}</div>
                    <div className="ccsub">@{c.tag} · {c.ir} iR · licenza {c.lic}</div>
                  </div>
                  <span className={`stato stato-${stato}`}>{STATO_LABEL[stato]}</span>
                </div>

                <div className="ccmetr">
                  <div>
                    <div className="ccbig">+{c.irMed} iR</div>
                    <div className="ccsm">mediana allievi · {c.gg} gg<br />{perSett(c.irMed, c.gg)} iR a settimana</div>
                  </div>
                </div>

                {f ? (
                  <div className="fit">Con piloti come te: <b>+{f[0]} iR in {f[1]} gg</b> · {f[2]} allievi</div>
                ) : (
                  <div className="fit no">
                    {iracingCollegato ? "Nessun dato nella tua fascia." : "Collega iRacing per il confronto nella tua fascia."}
                  </div>
                )}

                <div className="specbox">
                  {c.obiettivi.map((k) => (
                    <div className="specbox-item" key={k}>{OBIETTIVI.find((o) => o.k === k)?.l || k}</div>
                  ))}
                </div>
                {c.patto && (
                  <div className="chips" style={{ marginTop: 8 }}>
                    <span className="chip p">Patto di risultato</span>
                  </div>
                )}

                <div className="ccfoot">
                  <span className="ccsm">{c.tracciati} allievi tracciati · agg. {c.agg}</span>
                  <span className="prezzo lg">{c.prezzo}€ <small>/h</small></span>
                </div>
              </button>

              {stato === "avviso" && (() => {
                const alt = alternative(c);
                return (
                  <div className="notaBox ambra">
                    <p>
                      Lavora di solito con piloti <b>{FASCE_FRASE[c.fasciaDichiarata]}</b>. Potrebbe dare
                      per scontati fondamentali che stai ancora costruendo.
                    </p>
                    {alt.length > 0 && (
                      <>
                        <p style={{ marginTop: 8 }}>Questi hanno risultati migliori con piloti come te:</p>
                        <div className="altList">
                          {alt.map((a) => <button key={a.id} onClick={() => apri(a)}>{a.nome}</button>)}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Scheda({ c, mia, miaIr, iracingCollegato, walletOre, apriAcquistoOre, apriCalendario, chiudi, vaiPercorso, vediCoach, apriChat, nonLettiDi }) {
  const [apri, setApri] = useState(false);
  const f = iracingCollegato ? c.fasce[mia] : undefined;
  const allievoIr = iRAllievo(miaIr, mia);
  const stato = iracingCollegato ? calcolaStato(c, allievoIr, mia) : "neutro";
  const nonLetti = nonLettiDi?.(c.id) || 0;
  const alternative = COACHES.filter((x) => x.id !== c.id &&
    x.cat.some((k) => c.cat.includes(k)) &&
    calcolaStato(x, allievoIr, mia) === "consigliato").slice(0, 3);

  return (
    <div className="w">
      <button className="indietro" onClick={chiudi}>← Torna ai coach</button>

      <div className="cctop" style={{ marginTop: 8 }}>
        <div className="avat" style={{ width: 56, height: 56, fontSize: 20 }}>{iniz(c.nome)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 28 }}>{c.nome}</h2>
          <div className="ccsub">@{c.tag} · {c.ir} iR · licenza {c.lic} · {c.prezzo}€/h</div>
        </div>
        <span className={`stato stato-${stato}`}>{STATO_LABEL[stato]}</span>
      </div>

      <div style={{ marginTop: 14 }}>
        <button className="b b-ghost" onClick={() => apriChat?.(c.id)}>
          Messaggia
          {nonLetti > 0 && <span className="badge">{nonLetti}</span>}
        </button>
      </div>

      {stato === "avviso" && (
        <div className="notaBox ambra">
          <p>
            Lavora di solito con piloti <b>{FASCE_FRASE[c.fasciaDichiarata]}</b>. Potrebbe dare per
            scontati fondamentali che stai ancora costruendo.
          </p>
          {alternative.length > 0 && (
            <>
              <p style={{ marginTop: 8 }}>Questi hanno risultati migliori con piloti come te:</p>
              <div className="altList">
                {alternative.map((a) => <button key={a.id} onClick={() => vediCoach(a)}>{a.nome}</button>)}
              </div>
            </>
          )}
        </div>
      )}

      <div className="stit"><span>Risultati allievi · 90 giorni</span><span>agg. {c.agg}</span></div>
      <div className="blocco">
        <div className="ccmetr" style={{ marginTop: 0 }}>
          <div>
            <div className="ccbig" style={{ fontSize: 40 }}>+{c.irMed} iR</div>
            <div className="ccsm">
              mediana per allievo, in {c.gg} giorni<br />
              {perSett(c.irMed, c.gg)} iR a settimana · {c.tracciati} allievi
            </div>
          </div>
          <Spark curva={c.curva} start={c.start} w={130} h={46} />
        </div>
        <p className="nota">
          Linea grigia: i 30 giorni prima della prima sessione. Linea blu: dopo. Il tratteggio rosso
          è il giorno in cui è iniziato il coaching.
        </p>
        <button className="apri" onClick={() => setApri(!apri)}>
          {apri ? "▾" : "▸"} Come calcoliamo questo numero
        </button>
        {apri && (
          <ul className="regole">
            <li>Solo allievi con account iRacing collegato e consenso dato.</li>
            <li>Almeno otto gare dopo la prima sessione.</li>
            <li>Mediana, non media.</li>
            <li>Normalizzato sulla fascia di partenza.</li>
            <li>Sotto i tre allievi in una fascia non mostriamo nulla.</li>
          </ul>
        )}
      </div>

      <div className="stit"><span>Dove funziona davvero</span></div>
      <div className="blocco">
        {FASCE.map((fa) => {
          const d = c.fasce[fa.k];
          const on = iracingCollegato && fa.k === mia;
          return (
            <div className="riga" key={fa.k}
                 style={on ? { background: "var(--bluSoft)", margin: "0 -18px", padding: "10px 18px" } : undefined}>
              <span style={on ? { color: "var(--blu2)" } : undefined}>
                {fa.l} {on && <span className="nn">· la tua fascia</span>}
              </span>
              {d
                ? <span><b className="mn">+{d[0]} iR</b> <span className="nn">in {d[1]} gg · {d[2]} allievi</span></span>
                : <span className="nn">dato insufficiente</span>}
            </div>
          );
        })}
        <p className="nota">
          {!iracingCollegato
            ? "Collega il tuo account iRacing per vedere il ritmo tipico nella tua fascia."
            : f
              ? `Nella tua fascia il ritmo è di ${perSett(f[0], f[1])} iR a settimana su ${f[2]} allievi.`
              : "In questa fascia non ha storico: prenoti al buio, il prezzo dovrebbe rifletterlo."}
        </p>
      </div>

      <div className="stit"><span>Fascia dichiarata dal coach</span></div>
      <div className="blocco">
        <p className="nota" style={{ marginTop: 0 }}>{fraseDichiarazione(c)}</p>
      </div>

      {c.patto && (
        <>
          <div className="stit"><span>Patto di risultato</span></div>
          <div className="blocco" style={{ borderColor: "var(--rosso2)" }}>
            <div className="riga">
              <span>Obiettivo dichiarato dal coach</span>
              <b className="mn" style={{ color: "var(--rosso2)" }}>+{c.patto.ir} iR in {c.patto.gg} giorni</b>
            </div>
            <p className="nota">
              Se non ci arrivi, e hai fatto i compiti e almeno otto gare, la sessione successiva è a
              carico del coach. Lo decide il sistema sui dati.
            </p>
          </div>
        </>
      )}

      <div className="stit"><span>Come lavora</span></div>
      <p style={{ fontSize: 15, color: "var(--grigio)", lineHeight: 1.65 }}>{c.bio}</p>
      <ol style={{ paddingLeft: 20, marginTop: 14 }}>
        {c.metodo.map((m, i) => (
          <li key={i} style={{ color: "var(--grigio)", fontSize: 14.5, lineHeight: 1.6, marginBottom: 8 }}>{m}</li>
        ))}
      </ol>
      <div className="chips" style={{ marginTop: 16 }}>
        {c.auto.map((a) => <span className="chip" key={a}>{a}</span>)}
      </div>

      <div className="stit"><span>Allievi verificati</span></div>
      {c.rec.map((r, i) => (
        <div className="recens" key={i}>
          <div className="recmeta"><span style={{ color: "var(--bianco)" }}>{r.chi}</span><span>{r.auto}</span></div>
          <p>{r.txt}</p>
          <div className="recmeta">
            <span style={{ color: "var(--blu2)" }}>+{r.ir} iR in {r.gg} giorni</span>
            <span>{perSett(r.ir, r.gg)} iR/sett.</span>
          </div>
        </div>
      ))}

      <div className="stit"><span>Pacchetti ore</span></div>
      <div className="blocco">
        <p className="nota" style={{ marginTop: 0 }}>
          Con {c.nome} non paghi a sessione: compri un pacchetto di ore e le usi quando prenoti. Le
          ore restano tue finché non le allochi su uno slot.
        </p>
        <div className="offerteGrid">
          {c.offerte.map((o, i) => (
            <div className="offertaCard" key={i}>
              <div className="kval" style={{ fontSize: 26 }}>{o.ore} ore</div>
              <div className="ccsm">{o.prezzo.toFixed(2)} € totali</div>
              <button className="b b-blu" style={{ marginTop: 10, width: "100%" }}
                      onClick={() => apriAcquistoOre?.(c, o)}>
                Compra
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="stit"><span>Alloca ore</span></div>
      <div className="blocco">
        <div className="riga">
          <span>Ore disponibili con {c.nome}</span>
          <b className="mn" style={{ color: walletOre > 0 ? "var(--blu2)" : "var(--distr2)" }}>{walletOre}</b>
        </div>
        {walletOre === 0 ? (
          <p className="nota">
            Non hai ore con {c.nome}: le ore comprate da un altro coach non si possono usare qui.
            Compra un pacchetto qui sopra prima di allocare.
          </p>
        ) : (
          <p className="nota">Scegli uno o più slot da {DURATA_SESSIONE_ORE} ora sul calendario di {c.nome}.</p>
        )}
      </div>
      <div style={{ margin: "16px 0 40px" }}>
        <button className="b b-blu b-lg" style={{ width: "100%" }} disabled={walletOre === 0}
                onClick={() => apriCalendario?.(c)}>
          {walletOre === 0 ? "Nessuna ora da allocare" : "Apri il calendario"}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- CALENDARIO DI ALLOCAZIONE ----------------------------------
   Spende le ore già comprate CON QUESTO COACH allocandole su slot da 1 ora. Due viste sullo
   stesso stato (dataRif + selezionati): griglia settimanale su schermo largo, agenda a giorno
   singolo su mobile — cambia solo il CSS che mostra l'una o l'altra (@media(max-width:640px)),
   cosi' non serve rilevare il viewport in JS e non c'e' rischio di mismatch fra le due viste.
   La disponibilita' del coach passa TUTTA da fasciaDiOrario(): quando esistera' un calendario
   coach vero, si sostituisce quella funzione e questo componente non cambia. */
function CalendarioAllocazione({ coach: c, walletOre, prenotazioni, fusoPilota, onConferma, chiudi, vaiPercorso }) {
  const [dataRif, setDataRif] = useState(() => new Date());
  const [selezionati, setSelezionati] = useState(anyOf([])); // [{ giornoIso, ora }]
  const [motivo, setMotivo] = useState(""); // spiegazione mostrata al tocco di uno slot non selezionabile
  const [step, setStep] = useState("selezione"); // selezione | riepilogo | successo
  const [prenotateOra, setPrenotateOra] = useState(anyOf([])); // congelate al momento della conferma, per lo step "successo"

  const ORE = anyOf([]);
  for (let o = ORA_CALENDARIO_INIZIO; o < ORA_CALENDARIO_FINE; o++) ORE.push(o);

  // stato di un singolo slot — un solo punto di verita' per griglia e agenda,
  // cosi' le due viste non possono disallinearsi fra loro
  function statoSlot(giornoJs, ora) {
    if (slotPassato(giornoJs, ora)) return "passato";
    const fascia = fasciaDiOrario(giornoJs, ora);
    if (!fascia || !c.fasceOrarie.includes(fascia)) return "non-disponibile";
    if (slotOccupato(prenotazioni, c.id, dataIso(giornoJs), `${String(ora).padStart(2, "0")}:00`)) return "occupato";
    if (selezionati.some((s) => s.giornoIso === dataIso(giornoJs) && s.ora === ora)) return "selezionato";
    return "libero";
  }

  function motivoBlocco(stato, giornoJs) {
    if (stato === "passato") return "Questo slot è nel passato.";
    if (stato === "occupato") return "Slot già occupato da un'altra sessione con questo coach.";
    if (stato === "non-disponibile")
      return `${c.nome} non è disponibile in questa fascia: le sue fasce dichiarate sono ${c.fasceOrarie.join(", ")}.`;
    return "";
  }

  function clickSlot(giornoJs, ora) {
    const stato = statoSlot(giornoJs, ora);
    const giornoIso = dataIso(giornoJs);
    if (stato === "selezionato") {
      setSelezionati((prev) => prev.filter((s) => !(s.giornoIso === giornoIso && s.ora === ora)));
      setMotivo("");
      return;
    }
    if (stato === "libero") {
      // il tetto mensile (TETTO_ORE_MENSILI) e' gia' rispettato per costruzione: walletOre
      // e' un pezzo delle ore disponibili totali, che accreditaOre non fa mai superare il
      // tetto — quindi qui basta il vincolo vero e proprio, il saldo CON QUESTO coach
      if (selezionati.length >= walletOre) {
        setMotivo(
          `Hai già selezionato ${selezionati.length} ${selezionati.length === 1 ? "ora" : "ore"}: ` +
          `è il massimo disponibile con ${c.nome} (tetto di ${TETTO_ORE_MENSILI} ore/mese già rispettato ` +
          `sul totale del tuo portafoglio). Togli uno slot, oppure ricarica per allocarne altri.`
        );
        return;
      }
      setSelezionati((prev) => [...prev, { giornoIso, ora }]);
      setMotivo("");
      return;
    }
    setMotivo(motivoBlocco(stato, giornoJs));
  }

  const confermaPrenotazione = () => {
    const ok = onConferma?.(c, selezionati.map((s) => ({ ...s, oraLabel: `${String(s.ora).padStart(2, "0")}:00` })));
    if (ok) {
      setPrenotateOra(selezionati);
      setSelezionati([]);
      setStep("successo");
    }
  };

  if (walletOre <= 0)
    return (
      <div className="w">
        <button className="indietro" onClick={chiudi}>← Torna alla scheda</button>
        <div className="stit" style={{ marginTop: 10 }}><span>Alloca ore con {c.nome}</span></div>
        <div className="notaBox distr">
          <p><b>Nessuna ora disponibile con {c.nome}.</b> Le ore comprate da un altro coach non si possono
          usare qui: compra un pacchetto sulla sua scheda per poter allocare uno slot.</p>
        </div>
      </div>
    );

  if (step === "successo") {
    const oreTot = prenotateOra.length;
    return (
      <div className="w">
        <div className="ok">
          <div className="stit" style={{ marginTop: 0, borderBottom: 0, padding: 0 }}><span>Prenotazione confermata</span></div>
          <p style={{ marginTop: 10 }}>
            {oreTot} {oreTot === 1 ? "slot allocato" : "slot allocati"} con {c.nome}. Le sessioni sono ora in
            "Prossime sessioni di coaching" e nel calendario unico. Il saldo con {c.nome} è sceso di {oreTot}
            {oreTot === 1 ? " ora" : " ore"}.
          </p>
          <ul className="regole" style={{ marginTop: 14 }}>
            {prenotateOra.map((s, i) => (
              <li key={i}>{s.giornoIso} · {String(s.ora).padStart(2, "0")}:00</li>
            ))}
          </ul>
          <p className="nota">
            Fino a {FINESTRA_CANCELLAZIONE_ORE}h prima puoi ancora cancellare senza perdere l'ora: sotto quella
            soglia resta scalata anche se non ti presenti tu.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            {walletOre - oreTot > 0 && (
              <button className="b b-ghost" onClick={() => setStep("selezione")}>Alloca altre ore</button>
            )}
            <button className="b b-blu" onClick={vaiPercorso}>Vai al tuo percorso</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "riepilogo") {
    const saldoResiduo = walletOre - selezionati.length;
    // ordine cronologico: confronto sulla data ISO e poi sull'ora come numero
    // (non come stringa concatenata, altrimenti "12" ordinerebbe prima di "9")
    const ordinati = [...selezionati].sort((a, b) =>
      a.giornoIso !== b.giornoIso ? (a.giornoIso > b.giornoIso ? 1 : -1) : a.ora - b.ora);
    return (
      <div className="w">
        <button className="indietro" onClick={() => setStep("selezione")}>← Torna al calendario</button>
        <div className="stit" style={{ marginTop: 10 }}><span>Riepilogo allocazione</span></div>
        <div className="blocco">
          {ordinati.map((s, i) => (
            <div className="riga" key={i}>
              <span>{s.giornoIso} · {String(s.ora).padStart(2, "0")}:00 con {c.nome}</span>
              <b className="mn">{DURATA_SESSIONE_ORE} ora</b>
            </div>
          ))}
          <div className="riga"><span>Ore totali</span><b className="mn">{selezionati.length}</b></div>
          <div className="riga">
            <span>Saldo con {c.nome} dopo la conferma</span>
            <b className="mn" style={{ color: "var(--blu2)" }}>{saldoResiduo}</b>
          </div>
        </div>
        <div style={{ margin: "16px 0 40px", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="b b-blu b-lg" style={{ flex: 1, minWidth: 200 }} onClick={confermaPrenotazione}>
            Conferma prenotazione
          </button>
          <button className="b b-ghost" onClick={() => setStep("selezione")}>Modifica selezione</button>
        </div>
      </div>
    );
  }

  // ---- step "selezione": griglia (desktop) + agenda (mobile), stesso stato ----
  const lunedi = lunediDellaSettimana(dataRif);
  const giorniSettimana = GIORNI_SETTIMANA.map((_, i) => addGiorni(lunedi, i));
  const fusoDiverso = c.fuso && c.fuso !== fusoPilota;

  return (
    <div className="w">
      <button className="indietro" onClick={chiudi}>← Torna alla scheda</button>
      <div className="stit" style={{ marginTop: 10 }}><span>Alloca ore con {c.nome}</span></div>

      <div className="blocco">
        <div className="riga">
          <span>Ore da allocare</span>
          <b className="mn" style={{ color: "var(--blu2)" }}>{selezionati.length} / {walletOre}</b>
        </div>
        <p className="nota" style={{ marginTop: 8 }}>
          Orari in ora locale del pilota ({fusoPilota}).
          {fusoDiverso && ` ${c.nome} è su un fuso diverso (${c.fuso}): l'orario del coach è indicato tra parentesi su ogni slot libero.`}
        </p>
        {motivo && <p className="nota" style={{ color: "var(--distr2)" }}>{motivo}</p>}
      </div>

      {/* griglia — schermo largo, righe = ore, colonne = giorni */}
      <div className="calGridWrap">
        <div className="calNav">
          <button className="b b-ghost" onClick={() => setDataRif((d) => addGiorni(d, -7))} aria-label="Settimana precedente">‹ Settimana</button>
          <span className="calNavLabel">{dataIso(giorniSettimana[0])} – {dataIso(giorniSettimana[6])}</span>
          <button className="b b-ghost" onClick={() => setDataRif((d) => addGiorni(d, 7))} aria-label="Settimana successiva">Settimana ›</button>
        </div>
        <div className="calGrid">
          <div className="calGridHeadCell" />
          {giorniSettimana.map((g, i) => (
            <div className="calGridHeadCell" key={i}>
              {GIORNI_SETTIMANA[i]}<b>{g.getDate()}</b>
            </div>
          ))}
          {ORE.map((ora) => (
            <React.Fragment key={ora}>
              <div className="calGridOra">{String(ora).padStart(2, "0")}:00</div>
              {giorniSettimana.map((g, i) => {
                const stato = statoSlot(g, ora);
                const oraCoach = fusoDiverso ? oraLocaleCoach(ora, c.fuso, fusoPilota) : null;
                return (
                  <button key={i} className="calCell" data-stato={stato}
                          title={stato === "libero" || stato === "selezionato" ? undefined : motivoBlocco(stato, g)}
                          onClick={() => clickSlot(g, ora)}>
                    {stato === "selezionato" ? "✓" : ""}
                    {(stato === "libero" || stato === "selezionato") && oraCoach && <small> ({oraCoach})</small>}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* agenda — mobile, un giorno alla volta, righe a piena larghezza */}
      <div className="calAgenda">
        <div className="calNav">
          <button className="b b-ghost" onClick={() => setDataRif((d) => addGiorni(d, -1))} aria-label="Giorno precedente">‹</button>
          <span className="calNavLabel">{GIORNI_SETTIMANA[(dataRif.getDay() + 6) % 7]} {dataIso(dataRif)}</span>
          <button className="b b-ghost" onClick={() => setDataRif((d) => addGiorni(d, 1))} aria-label="Giorno successivo">›</button>
        </div>
        {ORE.map((ora) => {
          const stato = statoSlot(dataRif, ora);
          const oraCoach = fusoDiverso ? oraLocaleCoach(ora, c.fuso, fusoPilota) : null;
          return (
            <button key={ora} className="calAgendaRow" data-stato={stato} onClick={() => clickSlot(dataRif, ora)}>
              <span>{String(ora).padStart(2, "0")}:00{(stato === "libero" || stato === "selezionato") && oraCoach ? ` (coach ${oraCoach})` : ""}</span>
              <span className="ccsm">
                {stato === "selezionato" ? "✓ selezionato" : stato === "libero" ? "libero" : motivoBlocco(stato, dataRif)}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ margin: "16px 0 40px" }}>
        <button className="b b-blu b-lg" style={{ width: "100%" }} disabled={selezionati.length === 0}
                onClick={() => setStep("riepilogo")}>
          {selezionati.length === 0 ? "Scegli almeno uno slot" : `Vai al riepilogo · ${selezionati.length} ${selezionati.length === 1 ? "ora" : "ore"}`}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- ACQUISTO ORE ----------------------------------
   Pagamento simulato in un unico step separato dalla prenotazione: si comprano le
   ore qui, poi si allocano a parte sul calendario. Nessun dato di carta reale,
   nessun backend — ma stati ed esito sono quelli veri, pronti per Stripe dopo. */
function AcquistoOre({ coach, offerta, walletCoach, oreDisponibiliTotali, onSuccesso, onChiudi }) {
  const [step, setStep] = useState("riepilogo"); // riepilogo | pagamento | successo
  const [esitoUltimo, setEsitoUltimo] = useState(""); // "" | "errore" | "annullato"

  const commissione = (offerta.prezzo * COMMISSIONE_CORDA_PCT).toFixed(2);
  // il tetto è per persona, sommato su tutti i coach — non sul singolo
  // portafoglio — quindi si verifica sul totale, anche se l'accredito finisce
  // solo nel portafoglio di questo coach
  const totaleDopoAcquisto = oreDisponibiliTotali + offerta.ore;
  const superaTetto = totaleDopoAcquisto > TETTO_ORE_MENSILI;

  const paga = () => { setStep("successo"); onSuccesso(offerta.ore, offerta.prezzo); };
  const simulaErrore = () => { setEsitoUltimo("errore"); setStep("riepilogo"); };
  const annulla = () => { setEsitoUltimo("annullato"); setStep("riepilogo"); };

  if (step === "successo")
    return (
      <div className="w">
        <div className="ok">
          <h2 style={{ fontSize: 24, color: "var(--blu2)" }}>Pagamento riuscito</h2>
          <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.6 }}>
            {offerta.ore} ore aggiunte al tuo portafoglio con {coach.nome}. Sono già disponibili per
            prenotare una sessione.
          </p>
        </div>
        <div className="stit"><span>Riepilogo acquisto</span></div>
        <div className="blocco" style={{ marginBottom: 40 }}>
          <div className="riga"><span>Pacchetto</span><b className="mn">{offerta.ore} ore</b></div>
          <div className="riga"><span>Pagato</span><b className="mn" style={{ color: "var(--blu2)" }}>{offerta.prezzo.toFixed(2)} €</b></div>
          {/* walletCoach qui è già il saldo aggiornato: onSuccesso ha scalato lo
              stato in App nello stesso giro di re-render che porta a "successo",
              quindi non va sommato di nuovo a offerta.ore (altrimenti si conta due volte) */}
          <div className="riga"><b>Ore con {coach.nome} ora</b><b className="mn" style={{ color: "var(--verde)" }}>{walletCoach}</b></div>
        </div>
        <div style={{ margin: "0 0 40px" }}>
          <button className="b b-blu b-lg" style={{ width: "100%" }} onClick={onChiudi}>
            Torna al profilo di {coach.nome}
          </button>
        </div>
      </div>
    );

  if (step === "pagamento")
    return (
      <div className="w">
        <button className="indietro" onClick={() => setStep("riepilogo")}>← Torna al riepilogo</button>
        <div className="stit" style={{ marginTop: 8 }}><span>Pagamento</span></div>
        <div className="blocco">
          <p className="nota" style={{ marginTop: 0 }}>
            Pagamento simulato: in questo prototipo non viene richiesto né salvato nessun dato di
            carta reale. Il bottone "Paga" è pronto per essere collegato a Stripe.
          </p>
          <div className="riga"><b>Totale da pagare</b><b className="mn" style={{ color: "var(--blu2)" }}>{offerta.prezzo.toFixed(2)} €</b></div>
        </div>
        <div style={{ margin: "16px 0 10px" }}>
          <button className="b b-blu b-lg" style={{ width: "100%" }} onClick={paga}>
            Paga {offerta.prezzo.toFixed(2)} €
          </button>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
          <button className="b b-ghost" onClick={simulaErrore}>(demo) Simula un pagamento non riuscito</button>
          <button className="b b-ghost" onClick={annulla}>Annulla</button>
        </div>
      </div>
    );

  return (
    <div className="w">
      <button className="indietro" onClick={onChiudi}>← Torna al profilo di {coach.nome}</button>
      <div className="stit" style={{ marginTop: 8 }}><span>Compra ore</span><span>{coach.nome}</span></div>

      {esitoUltimo === "errore" && (
        <div className="notaBox ambra">
          <p><b>Il pagamento precedente non è andato a buon fine.</b> Nessuna ora è stata addebitata: puoi riprovare quando vuoi.</p>
        </div>
      )}
      {esitoUltimo === "annullato" && (
        <div className="notaBox">
          <p>Hai annullato il pagamento. Nessuna ora è stata addebitata.</p>
        </div>
      )}

      <div className="blocco">
        <div className="riga" style={{ color: "var(--grigio2)" }}>
          <span>Ore che hai già con {coach.nome}</span><span className="mn">{walletCoach}</span>
        </div>
        <div className="riga"><span>Pacchetto</span><b className="mn">{offerta.ore} ore</b></div>
        <div className="riga"><span>Prezzo totale</span><b className="mn">{offerta.prezzo.toFixed(2)} €</b></div>
        <div className="riga" style={{ color: "var(--grigio2)" }}>
          <span>di cui commissione CORDA ({(COMMISSIONE_CORDA_PCT * 100).toFixed(0)}%)</span>
          <span className="mn">{commissione} €</span>
        </div>
        <div className="riga"><b>Paghi ora</b><b className="mn" style={{ color: "var(--blu2)" }}>{offerta.prezzo.toFixed(2)} €</b></div>
      </div>

      {superaTetto ? (
        <div className="notaBox distr">
          <p>
            <b>Supereresti il tetto di {TETTO_ORE_MENSILI} ore mensili.</b> Il tetto conta le ore
            disponibili su tutti i coach insieme, non solo con {coach.nome}: ne hai già{" "}
            {oreDisponibiliTotali} in totale, con questo pacchetto arriveresti a {totaleDopoAcquisto}.
            Scegli un pacchetto più piccolo o usa prima le ore che hai.
          </p>
        </div>
      ) : (
        <div style={{ margin: "16px 0 40px" }}>
          <button className="b b-blu b-lg" style={{ width: "100%" }} onClick={() => setStep("pagamento")}>
            Vai al pagamento
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- CHAT ---------------------------------- */

function Chat({ coachId, chiudi, note, setNote, messaggi: tuttiMessaggi, setMessaggi, notificheEmail, setNotificheEmail }) {
  const co = COACHES.find((c) => c.id === coachId);
  const messaggi = tuttiMessaggi[coachId] || [];
  const [bozza, setBozza] = useState("");
  const [citaAperto, setCitaAperto] = useState(false);
  const [salvate, setSalvate] = useState(messaggi.map((m) => m.id).slice(0, 0));

  const noteCoach = note.filter((n) => n.coachId === coachId);

  const invia = () => {
    const testo = bozza.trim();
    if (!testo) return;
    setMessaggi(coachId, (prev) => [...prev, { id: `local-${prev.length}-${Date.now()}`, da: "pilota", testo, quando: new Date().toISOString(), letto: true }]);
    setBozza("");
  };

  // origine "chat": resta distinta dai consigli scritti dal coach in sessione
  // (punto 4) — non si mescolano nella lista note
  const salvaComeNota = (m) => {
    setNote((prev) => [
      { id: `n-${Date.now()}`, coachId, data: new Date().toISOString().slice(0, 10), pista: null, testo: m.testo, fatto: false, origine: "chat" },
      ...prev,
    ]);
    setSalvate((prev) => [...prev, m.id]);
  };

  const citaNota = (n) => {
    setBozza((prev) => (prev ? prev + "\n" : "") + `↳ Nota del ${fmtData(n.data)}: "${n.testo}"`);
    setCitaAperto(false);
  };

  return (
    <div className="w">
      <button className="indietro" onClick={chiudi}>← Torna indietro</button>

      <div className="cctop" style={{ marginTop: 8 }}>
        <div className="avat">{iniz(co?.nome || "?")}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="ccnome">{co?.nome || "Coach"}</div>
          <div className="ccsub">Chat privata · resta dentro CORDA</div>
        </div>
      </div>

      <div className="chatBox">
        {messaggi.length === 0 && (
          <p className="nota" style={{ marginTop: 0 }}>Nessun messaggio ancora. Scrivi per iniziare la conversazione.</p>
        )}
        {messaggi.map((m) => (
          <div className={`msg ${m.da === "pilota" ? "mio" : "loro"}`} key={m.id}>
            <p>{m.testo}</p>
            <span className="msgOra">
              {new Date(m.quando).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
              {m.da === "coach" && !salvate.includes(m.id) && (
                <button className="msgAzione" onClick={() => salvaComeNota(m)}>Salva come nota</button>
              )}
              {m.da === "coach" && salvate.includes(m.id) && <span className="msgAzione fatta">Salvato tra le note</span>}
            </span>
          </div>
        ))}
      </div>

      {noteCoach.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <button className="apri" onClick={() => setCitaAperto((v) => !v)}>
            {citaAperto ? "▾ Chiudi" : "▸ Cita una nota"}
          </button>
          {citaAperto && (
            <div className="blocco" style={{ marginTop: 6 }}>
              {noteCoach.map((n) => (
                <button className="citarow" key={n.id} onClick={() => citaNota(n)}>
                  <span>{n.testo}</span><span className="nn">{fmtData(n.data)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="chatInput">
        <input type="text" value={bozza} onChange={(e) => setBozza(e.target.value)}
               placeholder="Scrivi un messaggio…" onKeyDown={(e) => e.key === "Enter" && invia()} />
        <button className="b b-blu" onClick={invia}>Invia</button>
      </div>
      <p className="nota">
        I messaggi restano dentro CORDA e seguono le stesse regole di privacy e conservazione del
        resto dei tuoi dati.
      </p>

      <label className="prefEmail">
        <input type="checkbox" checked={notificheEmail} onChange={(e) => setNotificheEmail(e.target.checked)} />
        Ricevi un'email quando arriva un nuovo messaggio e non sei online. Puoi disattivarlo quando vuoi.
      </label>
    </div>
  );
}

/* ------------------------------ STANZA SESSIONE ------------------------------
   Il bottone "Avvia sessione" apre questa pagina: la cornice CORDA attorno a una
   videochiamata. Il fornitore WebRTC (LiveKit / Daily / Whereby — [DA CONFERMARE])
   non è ancora scelto, quindi qui c'è solo il placeholder + il legame con la
   prenotazione. Quello che conta davvero, e che costruiamo già ora, è cosa
   succede a fine sessione: è lì che la sessione lascia traccia in CORDA anche se
   il coach preferisce condurla altrove.
   Niente registrazione: fuori scope per questo giro (consenso di entrambe le
   parti, storage, obblighi GDPR aggiuntivi — si valuta a parte). */
function StanzaSessione({ prenotazione, coach, chiudi, onTermina, vaiScheda }) {
  const [terminata, setTerminata] = useState(false);
  const [confermaTermina, setConfermaTermina] = useState(false);
  const dataOrario = prenotazione.orario.includes("·")
    ? prenotazione.orario
    : `${fmtData(prenotazione.data)} · ${prenotazione.orario}`;

  const termina = () => {
    onTermina();
    setTerminata(true);
  };

  if (terminata)
    return (
      <div className="w">
        <div className="ok" style={{ marginTop: 26 }}>
          <h2 style={{ fontSize: 22, color: "var(--blu2)" }}>Sessione registrata</h2>
          <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.6 }}>
            Anche se la videochiamata è avvenuta altrove, partendo da qui la sessione resta
            tracciata in CORDA.
          </p>
        </div>
        <div className="blocco">
          <div className="riga"><span>Conteggio sessioni</span><b className="mn" style={{ color: "var(--blu2)" }}>aggiornato</b></div>
          <div className="riga"><span>Richiesta di nota</span><b className="mn" style={{ color: "var(--blu2)" }}>inviata a {coach?.nome}</b></div>
          <div className="riga"><span>Richiesta di recensione</span><b className="mn" style={{ color: "var(--blu2)" }}>avviata</b></div>
        </div>
        <div style={{ margin: "20px 0 40px", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="b b-blu" onClick={() => { chiudi(); vaiScheda?.(coach); }}>
            Prenota la prossima sessione
          </button>
          <button className="b b-ghost" onClick={chiudi}>Torna al percorso</button>
        </div>
      </div>
    );

  return (
    <div className="w">
      <button className="indietro" onClick={chiudi}>← Torna al percorso</button>
      <div className="stit" style={{ marginTop: 8 }}><span>Sessione con {coach?.nome}</span><span>{dataOrario}</span></div>

      <div className="stanzaVideo">
        <div>
          <div className="eyebrow">Stanza video · fornitore da confermare</div>
          <p style={{ marginTop: 10, color: "var(--grigio)", fontSize: 14.5, lineHeight: 1.6, maxWidth: "40ch", margin: "10px auto 0" }}>
            Qui comparirà la stanza video/voce/condivisione schermo, incorporata da un fornitore
            WebRTC specializzato (LiveKit, Daily o Whereby — scelta ancora da confermare).
          </p>
        </div>
      </div>

      <div className="blocco" style={{ marginTop: 16 }}>
        <div className="riga"><span>Coach</span><span>{coach?.nome}</span></div>
        <div className="riga"><span>Sessione</span><span>{dataOrario}</span></div>
        <div className="riga"><span>Pilota</span><span>{PILOTA_DEMO.nome}</span></div>
      </div>

      <p className="nota">
        Il coach può comunque condurre la sessione dal suo Discord se preferisce: partendo da qui,
        resta comunque tracciata in CORDA.
      </p>

      {confermaTermina && (
        <div className="notaBox distr" style={{ marginTop: 14 }}>
          <p>
            <b>Terminare la sessione?</b> Partiranno il conteggio sessioni, la richiesta di nota al
            coach e la richiesta di recensione.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="b b-distr" onClick={termina}>Conferma</button>
            <button className="b b-ghost" onClick={() => setConfermaTermina(false)}>Annulla</button>
          </div>
        </div>
      )}

      <div style={{ margin: "20px 0 40px" }}>
        <button className="b b-rosso b-lg" style={{ width: "100%" }} onClick={() => setConfermaTermina(true)}>
          Termina sessione
        </button>
      </div>
    </div>
  );
}

/* ---------------------------- Scheda Pilota --------------------------------
   Chi sei, non come stai andando: statica, è quello che il coach vede quando
   siete abbinati (a differenza de "Il mio percorso", che è dinamica ed è solo
   per il pilota). Due strati come "Il mio percorso": obiettivi/logistica/
   postazione/nota sono dati CORDA, disponibili subito; identità verificata,
   iRating, licenza e Safety Rating arrivano dall'account iRacing collegato.
   Lo stato qui dentro è locale al componente, come i filtri di Cerca: si
   azzera se lasci la scheda e ci torni — stessa scelta già fatta altrove. */

// sintesi di sola lettura: quello che vede il coach quando siete abbinati —
// email e dati di fatturazione non compaiono qui perché non fanno parte del
// profilo che il coach vede, restano un dato di account privato
function AnteprimaScheda({
  iracingCollegato, vetture, obiettivi, irTarget, fasceOrarie, lingua, fuso, volante, cellaDiCarico, base, notaCoach,
}) {
  return (
    <div className="blocco">
      <div className="eyebrow">Quello che vede il coach quando siete abbinati</div>

      <div className="stit" style={{ marginTop: 18 }}><span>Identità verificata</span></div>
      {iracingCollegato ? (
        <div className="riga"><span>iRating</span><b className="mn" style={{ color: "var(--blu2)" }}>{PILOTA_DEMO.ir} · verificato</b></div>
      ) : <p className="nn">Non ancora collegato — il coach non vede un iRating verificato.</p>}

      <div className="stit" style={{ marginTop: 18 }}><span>Cosa guido</span></div>
      <div className="chips">
        {vetture.length > 0
          ? vetture.map((v) => <span className="chip" key={v}>{v}</span>)
          : <span className="nn">Nessuna vettura indicata</span>}
      </div>

      <div className="stit" style={{ marginTop: 18 }}><span>Obiettivi</span></div>
      <div className="chips">
        {obiettivi.length > 0
          ? obiettivi.map((k) => <span className="chip" key={k}>{OBIETTIVI.find((o) => o.k === k)?.l}</span>)
          : <span className="nn">Nessun obiettivo indicato</span>}
        {irTarget && <span className="chip">Target: +{irTarget} iR</span>}
      </div>

      <div className="stit" style={{ marginTop: 18 }}><span>Logistica</span></div>
      <div className="chips">
        {fasceOrarie.length > 0
          ? fasceOrarie.map((f) => <span className="chip" key={f}>{f}</span>)
          : <span className="nn">Nessuna fascia indicata</span>}
      </div>
      <p className="nn" style={{ marginTop: 8 }}>
        {LINGUE.find((l) => l.k === lingua)?.l} · {fuso}
      </p>

      {(volante || cellaDiCarico || base) && (
        <>
          <div className="stit" style={{ marginTop: 18 }}><span>Postazione</span></div>
          <p className="nn">{[volante, cellaDiCarico, base].filter(Boolean).join(" · ")}</p>
        </>
      )}

      {notaCoach && (
        <>
          <div className="stit" style={{ marginTop: 18 }}><span>Nota per il coach</span></div>
          <p className="nota" style={{ marginTop: 0 }}>"{notaCoach}"</p>
        </>
      )}

      <p className="nota" style={{ marginTop: 20 }}>
        Email e dati di fatturazione restano privati: il coach non li vede mai da qui.
      </p>
    </div>
  );
}

function SchedaPilota({ vaiPercorso, iracingCollegato, setIracingCollegato }) {
  const [anteprima, setAnteprima] = useState(false);

  // 2. cosa guido — dichiarate dal pilota, alimentano il matching
  const [vetture, setVetture] = useState(["Ferrari 296 GT3"]);
  const [vetturaDaAggiungere, setVetturaDaAggiungere] = useState(TUTTE);
  const aggiungiVettura = () => {
    if (vetturaDaAggiungere !== TUTTE && !vetture.includes(vetturaDaAggiungere))
      setVetture((prev) => [...prev, vetturaDaAggiungere]);
  };
  const rimuoviVettura = (v) => setVetture((prev) => prev.filter((x) => x !== v));

  // 3. obiettivi — stessa tassonomia e stesso limite del filtro coach
  const [obiettivi, setObiettivi] = useState(["gomme", "passo_gara"]);
  const toggleObiettivo = (k) =>
    setObiettivi((prev) => {
      if (prev.includes(k)) return prev.filter((x) => x !== k);
      if (prev.length >= MAX_OBIETTIVI) return prev;
      return [...prev, k];
    });
  const [irTarget, setIrTarget] = useState("");

  // 4. logistica per l'abbinamento
  const [fasceOrarie, setFasceOrarie] = useState(["Weekend giorno", "Weekend sera"]);
  const toggleFasciaOraria = (v) =>
    setFasceOrarie((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  const [lingua, setLingua] = useState("it");
  const [fuso, setFuso] = useState("Europe/Rome");

  // 5. postazione, opzionale
  const [volante, setVolante] = useState("");
  const [cellaDiCarico, setCellaDiCarico] = useState("");
  const [base, setBase] = useState("");

  // 6. nota libera per il coach
  const [notaCoach, setNotaCoach] = useState("");

  // 7. mini-riepilogo: rimanda a "Il mio percorso", non lo duplica
  const coachAttuale = COACHES.find((c) => c.id === PERCORSO.coachAttualeId);

  if (anteprima)
    return (
      <div className="w">
        <div className="stit" style={{ marginTop: 26 }}>
          <span>Scheda Pilota</span><span>Anteprima</span>
        </div>
        <div style={{ margin: "16px 0" }}>
          <button className="b b-ghost" onClick={() => setAnteprima(false)}>← Torna a modificare</button>
        </div>
        <AnteprimaScheda
          iracingCollegato={iracingCollegato} vetture={vetture} obiettivi={obiettivi} irTarget={irTarget}
          fasceOrarie={fasceOrarie} lingua={lingua} fuso={fuso} volante={volante}
          cellaDiCarico={cellaDiCarico && `pedali con cella di carico: ${cellaDiCarico}`} base={base}
          notaCoach={notaCoach}
        />
      </div>
    );

  return (
    <div className="w">
      <div className="stit" style={{ marginTop: 26 }}>
        <span>Scheda Pilota</span><span>{PILOTA_DEMO.nome}</span>
      </div>
      <p className="nota" style={{ marginTop: 0 }}>
        Chi sei, cosa guidi e cosa vuoi dal coaching — è quello che il coach vede quando siete
        abbinati. Per i tuoi progressi c'è "Il mio percorso".
      </p>

      <div style={{ margin: "16px 0" }}>
        <button className="b b-ghost" onClick={() => setAnteprima(true)}>
          👁 Anteprima come la vede il coach
        </button>
      </div>

      {/* 1. identità verificata — strato 2 */}
      <div className="stit"><span>Identità verificata</span></div>
      {iracingCollegato ? (
        <div className="blocco">
          <div className="riga"><span>Account iRacing</span><b className="mn" style={{ color: "var(--verde)" }}>Collegato</b></div>
          <div className="riga"><span>iRating</span><b className="mn" style={{ color: "var(--blu2)" }}>{PILOTA_DEMO.ir}</b></div>
          <div className="riga"><span>Licenza</span><b className="mn">{PILOTA_DEMO.licenza}</b></div>
          <div className="riga"><span>Su CORDA da</span><b className="mn">{PILOTA_DEMO.anniPiattaforma} anni</b></div>
        </div>
      ) : (
        <div className="lockbox">
          <div className="eyebrow">Da collegare</div>
          <p style={{ marginTop: 10, color: "var(--grigio)", fontSize: 14.5, lineHeight: 1.6 }}>
            Collega il tuo account iRacing per verificare identità, iRating, licenza e Safety
            Rating: è quello che il coach vede quando siete abbinati, ed è quello che fa
            funzionare il matching con Consigliato/Neutro/Avviso.
          </p>
          <button className="b b-blu" style={{ marginTop: 14 }} onClick={() => setIracingCollegato?.(true)}>
            Collega il tuo account iRacing
          </button>
        </div>
      )}

      {/* 2. cosa guido — strato 1, in parte dichiarato */}
      <div className="stit"><span>Cosa guido</span></div>
      <div className="campo">
        <label>Aggiungi una vettura</label>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={vetturaDaAggiungere} onChange={(e) => setVetturaDaAggiungere(e.target.value)}>
            <option>{TUTTE}</option>
            {gruppiDi("tutte").map(([nome, auto], i) => (
              <optgroup label={nome} key={`${nome}-${i}`}>
                {auto.map((a) => <option key={a}>{a}</option>)}
              </optgroup>
            ))}
          </select>
          <button className="b b-ghost" type="button" onClick={aggiungiVettura} style={{ flex: "none" }}>
            Aggiungi
          </button>
        </div>
      </div>
      {vetture.length > 0 && (
        <div className="chips" style={{ marginBottom: 6 }}>
          {vetture.map((v) => (
            <span className="chip" key={v} style={{ cursor: "pointer" }} onClick={() => rimuoviVettura(v)}
                  title="Tocca per togliere">{v} ×</span>
          ))}
        </div>
      )}
      <p className="nn">Alimenta il matching con i coach della tua categoria.</p>

      {/* 3. obiettivi — strato 1 */}
      <div className="stit"><span>Obiettivi</span></div>
      <div className="campo">
        <label>Cosa vuoi dal coaching · fino a {MAX_OBIETTIVI}</label>
        <div className="checkgrid">
          {OBIETTIVI.map((o) => {
            const on = obiettivi.includes(o.k);
            return (
              <OpzioneCheck key={o.k} checked={on} disabled={!on && obiettivi.length >= MAX_OBIETTIVI}
                            onChange={() => toggleObiettivo(o.k)}>
                {o.l}
              </OpzioneCheck>
            );
          })}
        </div>
        <p className="nn" style={{ marginTop: 8 }}>
          {obiettivi.length === 0 ? `Nessuno selezionato · fino a ${MAX_OBIETTIVI}` : `${obiettivi.length}/${MAX_OBIETTIVI} selezionati`}
        </p>
      </div>
      <div className="campo">
        <label>iRating obiettivo · opzionale</label>
        <input type="number" min="0" inputMode="numeric" value={irTarget}
               onChange={(e) => setIrTarget(e.target.value)} placeholder="es. 3000" />
      </div>

      {/* 4. logistica — strato 1, critica per l'abbinamento */}
      <div className="stit"><span>Logistica per l'abbinamento</span></div>
      <div className="campo">
        <label>Fasce orarie disponibili</label>
        <div className="checkgrid">
          {FASCE_ORARIE.map((v) => (
            <OpzioneCheck key={v} checked={fasceOrarie.includes(v)} onChange={() => toggleFasciaOraria(v)}>
              {v}
            </OpzioneCheck>
          ))}
        </div>
      </div>
      <div className="campo">
        <label>Lingua preferita</label>
        <select value={lingua} onChange={(e) => setLingua(e.target.value)}>
          {LINGUE.map((l) => <option key={l.k} value={l.k}>{l.l}</option>)}
        </select>
      </div>
      <div className="campo">
        <label>Fuso orario</label>
        <select value={fuso} onChange={(e) => setFuso(e.target.value)}>
          {FUSI.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* 5. postazione — strato 1, opzionale */}
      <div className="stit"><span>Postazione <span className="nn">· opzionale</span></span></div>
      <div className="campo">
        <label>Volante / base</label>
        <select value={volante} onChange={(e) => setVolante(e.target.value)}>
          <option value="">Preferisco non dirlo</option>
          <option value="Logitech G29/G923">Logitech G29/G923</option>
          <option value="Thrustmaster T300/TX">Thrustmaster T300/TX</option>
          <option value="Fanatec CSL DD">Fanatec CSL DD</option>
          <option value="Fanatec Podium DD">Fanatec Podium DD</option>
          <option value="Simucube 2">Simucube 2</option>
          <option value="Altro">Altro</option>
        </select>
      </div>
      <div className="campo">
        <label>Pedali con cella di carico</label>
        <select value={cellaDiCarico} onChange={(e) => setCellaDiCarico(e.target.value)}>
          <option value="">Non lo so</option>
          <option value="sì">Sì</option>
          <option value="no">No</option>
        </select>
      </div>
      <div className="campo">
        <label>Base</label>
        <select value={base} onChange={(e) => setBase(e.target.value)}>
          <option value="">Preferisco non dirlo</option>
          <option value="Scrivania / postazione da tavolo">Scrivania / postazione da tavolo</option>
          <option value="Rig fisso dedicato">Rig fisso dedicato</option>
          <option value="Altro">Altro</option>
        </select>
      </div>

      {/* 6. nota per il coach — strato 1 */}
      <div className="stit"><span>Nota per il coach</span></div>
      <div className="campo">
        <label>Cosa vuoi migliorare</label>
        <textarea value={notaCoach} onChange={(e) => setNotaCoach(e.target.value)}
                  placeholder="Es. Vorrei lavorare soprattutto sulla gestione gomme in gara lunga." />
      </div>

      {/* 7. mini-riepilogo percorso — rimanda, non duplica */}
      <div className="stit"><span>Il tuo percorso</span></div>
      <div className="metric" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "baseline" }}>
          <div>
            <div className="kval" style={{ fontSize: 34 }}>{PERCORSO.sessioniTotali}</div>
            <div className="ccsm">sessioni</div>
          </div>
          <div>
            <div className="kval" style={{ fontSize: 20 }}>{coachAttuale ? coachAttuale.nome : "—"}</div>
            <div className="ccsm">coach attuale</div>
          </div>
        </div>
        <button className="b b-ghost" style={{ marginTop: 16 }} onClick={vaiPercorso}>
          Vai al tuo percorso completo
        </button>
      </div>

      <p className="nota" style={{ marginBottom: 40 }}>
        Il coach abbinato può vedere identità verificata, vetture, obiettivi, logistica,
        postazione e nota. Email e dati di fatturazione restano privati.
      </p>
    </div>
  );
}

function Percorso({
  vaiScheda, apriChat, nonLettiDi, note, setNote, iracingCollegato, setIracingCollegato, simulaMessaggioCoach,
  walletPerCoach, oreDisponibiliTotali, oreAllocateDi, prenotazioni, sessioniTotali,
  spostaSessione, cancellaSessione, sospendiTuttoConCoach, segnalaNoShow, risolviContestazione, onTerminaSessione,
  apriAcquistoOre, apriCalendario,
}) {
  const [gareIds, setGareIds] = useState(PERCORSO.garePianificateIds);
  const [pickerAperto, setPickerAperto] = useState(false);
  const [ricaricaApertaPer, setRicaricaApertaPer] = useState(0); // coachId con il pannello offerte aperto, 0 = nessuno (gli id coach partono da 1)
  const [spostaAperto, setSpostaAperto] = useState(""); // id della prenotazione in modifica, "" = nessuna
  const [spostaScelto, setSpostaScelto] = useState(""); // slot scelto, in attesa di conferma
  const [cancellaConferma, setCancellaConferma] = useState(""); // id della prenotazione da confermare
  const [segnalaAperto, setSegnalaAperto] = useState(""); // id della prenotazione da segnalare come no-show
  const [sospendiAperto, setSospendiAperto] = useState(false);
  const [sospesoMsg, setSospesoMsg] = useState(false);
  // la prenotazione della stanza aperta, o null se nessuna — il cast JSDoc dà a
  // TS la forma vera dell'oggetto invece di bloccarlo su "null"
  const [sessioneAttiva, setSessioneAttiva] = useState(null);

  const toggleGara = (id) =>
    setGareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const chiediCancella = (id) => setCancellaConferma(id);
  const annullaCancella = () => setCancellaConferma("");
  const confermaCancella = (id) => {
    cancellaSessione(id);
    setCancellaConferma("");
  };

  const chiudiSposta = () => { setSpostaAperto(""); setSpostaScelto(""); };

  // lo slot scelto ("Gio 28 · 20:30") sostituisce interamente l'orario: la data
  // originale della prenotazione resta solo per l'ordinamento della lista.
  // Spostare non tocca il portafoglio: muove solo lo slot.
  const confermaSposta = (id, slot) => {
    spostaSessione(id, slot);
    chiudiSposta();
  };

  const sospendiTutto = () => {
    sospendiTuttoConCoach(coachAttuale?.id);
    setSospendiAperto(false);
    setSospesoMsg(true);
  };

  const coachAttuale = COACHES.find((c) => c.id === PERCORSO.coachAttualeId);
  const sessioniAllocate = prenotazioni.filter((p) => p.stato === "allocata");
  const sessioniInSospeso = prenotazioni.filter((p) => p.stato === "contestazione" || p.stato === "cancellata-addebitata");
  const prossimeSessioni = [...sessioniAllocate].sort((a, b) => a.data.localeCompare(b.data));
  const garePianificate = CALENDARIO_STAGIONE
    .filter((g) => gareIds.includes(g.id))
    .sort((a, b) => a.data.localeCompare(b.data));
  // ogni coach con cui il pilota ha mai avuto ore (disponibili o comprate):
  // un'ora vale solo con il coach da cui è stata comprata, quindi la barra
  // "ore a disposizione" è per coach, non un saldo unico
  const walletDi = (coachId) => walletPerCoach[coachId] || { disponibili: 0, acquistateTotali: 0 };
  const coachConWallet = anyOf(Object.keys(walletPerCoach)
    .map((id) => COACHES.find((c) => c.id === Number(id)))
    .filter(Boolean));
  // ogni sessione svolta vale DURATA_SESSIONE_ORE: piu' diretto e sempre
  // coerente che sottrarre disponibili+allocate dal totale storico (che
  // dovrebbe tornare uguale, ma dipende da cancellazioni/contestazioni
  // passate di cui qui non teniamo un registro separato)
  const oreUsate = sessioniTotali * DURATA_SESSIONE_ORE;

  // prenotazione "congelata" al click su Avvia sessione: resta stabile anche se
  // onTerminaSessione la segna nel frattempo come svolta, cosi' la schermata di
  // conferma non sparisce sotto i piedi dell'utente
  if (sessioneAttiva) {
    const s = anyOf(sessioneAttiva);
    return (
      <StanzaSessione
        prenotazione={s}
        coach={COACHES.find((c) => c.id === s.coachId)}
        chiudi={() => setSessioneAttiva(null)}
        onTermina={() => onTerminaSessione(s.id)}
        vaiScheda={vaiScheda}
      />
    );
  }

  return (
    <div className="w">
      {/* 1. riga-titolo: sintesi del percorso — solo dati CORDA finché non c'è iRacing */}
      <div className="stit" style={{ marginTop: 26 }}><span>Il tuo percorso</span></div>
      <div className="metric">
        <div className="eyebrow">Da quando fai coaching</div>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 12, alignItems: "baseline" }}>
          <div>
            <div className="kval" style={{ fontSize: 34 }}>{sessioniTotali}</div>
            <div className="ccsm">sessioni</div>
          </div>
          <div>
            <div className="kval" style={{ fontSize: 34 }}>{oreUsate}</div>
            <div className="ccsm">ore di coaching</div>
          </div>
        </div>
        <p className="nota">
          Il guadagno di iRating comparirà qui appena colleghi il tuo account iRacing.
        </p>
      </div>

      {/* 2. coach attuale + storico — il tuo percorso, non una classifica */}
      <div className="stit"><span>Il tuo coach</span></div>
      <div className="blocco">
        {coachAttuale ? (
          <>
            <div className="cctop">
              <div className="avat" style={{ width: 52, height: 52, fontSize: 18 }}>{iniz(coachAttuale.nome)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="ccnome">{coachAttuale.nome}</div>
                <div className="ccsub">
                  Dal {fmtData(PERCORSO.dalCoachAttuale)} · {PERCORSO.sessioniConAttuale} sessioni insieme
                </div>
              </div>
            </div>
            <p className="nota">
              <b className="mn" style={{ color: walletDi(coachAttuale.id).disponibili > 0 ? "var(--blu2)" : "var(--distr2)" }}>
                {walletDi(coachAttuale.id).disponibili} ore disponibili
              </b>{" "}
              con {coachAttuale.nome}.
              {oreAllocateDi(coachAttuale.id) > 0 && ` ${oreAllocateDi(coachAttuale.id)} già allocate su sessioni prenotate.`}
            </p>
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="b b-blu" onClick={() => vaiScheda?.(coachAttuale)}>Vai al suo profilo</button>
              <button className="b b-ghost" onClick={() => apriChat?.(coachAttuale.id)}>
                Messaggia
                {nonLettiDi?.(coachAttuale.id) > 0 && <span className="badge">{nonLettiDi(coachAttuale.id)}</span>}
              </button>
              <button className="b b-ghost" onClick={() => setSospendiAperto(true)}>Sospendi</button>
            </div>

            {sospendiAperto && (
              <div className="notaBox distr" style={{ marginTop: 14 }}>
                <p>
                  <b>Sospendere il coaching con {coachAttuale.nome}?</b> Tutte le sessioni prenotate
                  con lui verranno cancellate. Il vostro storico resta comunque visibile.
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button className="b b-distr" onClick={sospendiTutto}>Conferma sospensione</button>
                  <button className="b b-ghost" onClick={() => setSospendiAperto(false)}>Annulla</button>
                </div>
              </div>
            )}
            {sospesoMsg && (
              <p className="nota">
                Tutte le sessioni prenotate con {coachAttuale.nome} sono state cancellate.
              </p>
            )}
            <p className="nota">
              <button className="msgAzione" style={{ fontSize: 11.5 }}
                      onClick={() => simulaMessaggioCoach?.(coachAttuale.id, "Ti andrebbe di anticipare la sessione a domani?")}>
                ↻ Simula un messaggio in arrivo dal coach (demo)
              </button>
            </p>
          </>
        ) : (
          <p className="nota" style={{ marginTop: 0 }}>Non hai ancora un coach attivo.</p>
        )}
      </div>

      {PERCORSO.storicoCoach.length > 0 && (
        <>
          <div className="stit"><span>Con chi hai lavorato prima</span></div>
          <div className="blocco">
            {PERCORSO.storicoCoach.map((s, i) => {
              const co = COACHES.find((c) => c.id === s.coachId);
              if (!co) return null;
              return (
                <div className="storicoRiga" key={i}>
                  <span>{co.nome} <span className="nn">· {s.periodo}</span></span>
                  <span>
                    <b className="mn" style={{ color: "var(--blu2)" }}>+{s.irGuadagnato} iR</b>{" "}
                    <span className="nn">· {s.sessioni} sessioni · {s.auto.join(", ")}</span>
                  </span>
                </div>
              );
            })}
            <p className="nota">È il tuo percorso, non una classifica: questi numeri restano tuoi.</p>
          </div>
        </>
      )}

      {/* 3. dati iRacing — strato 2 */}
      <div className="stit"><span>I tuoi dati iRacing</span></div>
      {iracingCollegato ? (
        <div className="blocco">
          <div className="riga"><span>Account iRacing</span><b className="mn" style={{ color: "var(--verde)" }}>Collegato</b></div>
          <p className="nota">
            Il tuo iR in alto ora è verificato via API. Curva iRating, ultime gare con overlay
            coaching e licenza/Safety Rating arriveranno qui appena l'integrazione è pronta.
          </p>
        </div>
      ) : (
        <div className="lockbox">
          <div className="eyebrow">Da collegare</div>
          <p style={{ marginTop: 10, color: "var(--grigio)", fontSize: 14.5, lineHeight: 1.6 }}>
            Collega il tuo account iRacing per sbloccare qui la tua curva iRating, le ultime gare —
            con il confronto prima/dopo ogni sessione di coaching — e la tua licenza e Safety Rating.
            Il tuo iR qui sopra è per ora autodichiarato: appena colleghi l'account diventa verificato.
          </p>
          <button className="b b-blu" style={{ marginTop: 14 }} onClick={() => setIracingCollegato?.(true)}>
            Collega il tuo account iRacing
          </button>
        </div>
      )}

      {/* 4. ore acquistate — un portafoglio per coach, un'ora vale solo con
         chi l'ha venduta. Il totale qui sotto è solo un riepilogo a colpo
         d'occhio: quello che si spende resta sempre il saldo di un coach */}
      <div className="stit"><span>Le tue ore per coach</span></div>
      {coachConWallet.length === 0 ? (
        <div className="blocco">
          <p className="nota" style={{ marginTop: 0 }}>
            Non hai ancora comprato ore da nessun coach. Vai sul profilo di un coach e scegli un
            pacchetto per iniziare.
          </p>
        </div>
      ) : (
        <>
          <p className="nota" style={{ marginTop: 0 }}>
            <b className="mn">{oreDisponibiliTotali}</b> ore disponibili in totale su {coachConWallet.length}
            {coachConWallet.length === 1 ? " coach" : " coach diversi"} · riepilogo, non un saldo unico:
            ogni ora vale solo con il coach da cui è stata comprata. Tetto: {TETTO_ORE_MENSILI} ore al
            mese in tutto.
          </p>
          {coachConWallet.map((c) => {
            const w = walletDi(c.id);
            const allocate = oreAllocateDi(c.id);
            return (
              <div className="blocco" key={c.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "baseline" }}>
                  <div>
                    <div className="ccbig">{w.disponibili} ore disponibili</div>
                    <div className="ccsm">con {c.nome}, {w.acquistateTotali} acquistate in totale</div>
                  </div>
                  {allocate > 0 && (
                    <div>
                      <div className="kval" style={{ fontSize: 22 }}>{allocate}</div>
                      <div className="ccsm">allocate su sessioni prenotate</div>
                    </div>
                  )}
                </div>
                <div className="orebar"><div className="orebarfill" style={{ width: `${Math.min(100, (w.disponibili / TETTO_ORE_MENSILI) * 100)}%` }} /></div>
                {w.disponibili === 0 && (
                  <p className="nota">Nessuna ora disponibile con {c.nome}: ricarica per prenotare la prossima sessione.</p>
                )}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                  <button className="b b-ghost"
                          onClick={() => setRicaricaApertaPer((v) => (v === c.id ? 0 : c.id))}>
                    {ricaricaApertaPer === c.id ? "Chiudi" : "Ricarica ore"}
                  </button>
                  <button className="b b-blu" disabled={w.disponibili === 0}
                          onClick={() => apriCalendario?.(c)}>
                    Alloca ore
                  </button>
                </div>
                {ricaricaApertaPer === c.id && (
                  <div className="offerteGrid">
                    {c.offerte.map((o, i) => (
                      <div className="offertaCard" key={i}>
                        <div className="kval" style={{ fontSize: 22 }}>{o.ore} ore</div>
                        <div className="ccsm">{o.prezzo.toFixed(2)} € totali</div>
                        <button className="b b-blu" style={{ marginTop: 10, width: "100%" }}
                                onClick={() => apriAcquistoOre(c, o)}>
                          Compra
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* 5. calendario — sessioni di coaching e gare pianificate, due liste separate */}
      <div className="stit"><span>Prossime sessioni di coaching</span></div>
      <div className="blocco">
        {prossimeSessioni.length === 0 && <p className="nota" style={{ marginTop: 0 }}>Nessuna sessione in calendario.</p>}
        {prossimeSessioni.map((p) => {
          const co = COACHES.find((c) => c.id === p.coachId);
          const dataOrario = p.orario.includes("·") ? p.orario : `${fmtData(p.data)} · ${p.orario}`;
          const oreMancanti = oreAllaSessione(p);
          const rimborsabile = oreMancanti >= FINESTRA_CANCELLAZIONE_ORE;
          return (
            <div key={p.id}>
              <div className="riga" style={{ flexDirection: "column", alignItems: "stretch", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span><span className="dot" style={{ background: "var(--blu2)" }} />{dataOrario}</span>
                  <span className="nn">{co?.nome}</span>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="azsess avvia" onClick={() => setSessioneAttiva(anyOf(p))}>
                    Avvia sessione
                  </button>
                  <button className="azsess sposta"
                          onClick={() => (spostaAperto === p.id ? chiudiSposta() : (setSpostaAperto(p.id), setSpostaScelto("")))}>
                    Sposta
                  </button>
                  <button className="azsess cancella" onClick={() => chiediCancella(p.id)}>
                    Cancella
                  </button>
                </div>
                <button className="apri" style={{ alignSelf: "flex-start", minHeight: 44, display: "flex", alignItems: "center" }}
                        onClick={() => setSegnalaAperto(segnalaAperto === p.id ? "" : p.id)}>
                  Il coach non si è presentato?
                </button>
              </div>

              {cancellaConferma === p.id && (
                <div className="notaBox distr" style={{ marginTop: 0, marginBottom: 14 }}>
                  <p><b>Cancellare la sessione di {dataOrario}?</b></p>
                  <p>
                    {rimborsabile
                      ? `Mancano più di ${FINESTRA_CANCELLAZIONE_ORE} ore: l'ora torna nel tuo portafoglio e il coach non viene pagato per questo slot.`
                      : `Mancano meno di ${FINESTRA_CANCELLAZIONE_ORE} ore: l'ora resta scalata e il coach viene comunque pagato per lo slot bloccato.`}
                  </p>
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button className="b b-distr" onClick={() => confermaCancella(p.id)}>Conferma cancellazione</button>
                    <button className="b b-ghost" onClick={annullaCancella}>Annulla</button>
                  </div>
                </div>
              )}

              {segnalaAperto === p.id && (
                <div className="notaBox ambra" style={{ marginTop: 0, marginBottom: 14 }}>
                  <p>
                    <b>Segnalare che {co?.nome} non si è presentato?</b> L'ora resta congelata — né
                    persa né restituita — finché non verifichiamo cosa è successo. Quando la stanza
                    sessione traccerà le presenze in automatico, questo passaggio sparirà.
                  </p>
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button className="b b-blu" onClick={() => { segnalaNoShow(p.id); setSegnalaAperto(""); }}>
                      Conferma segnalazione
                    </button>
                    <button className="b b-ghost" onClick={() => setSegnalaAperto("")}>Annulla</button>
                  </div>
                </div>
              )}

              {spostaAperto === p.id && co && !spostaScelto && (
                <div className="slotgrid" style={{ marginTop: 0, marginBottom: 14 }}>
                  {co.slots.map((s) => (
                    <button key={s} className="slotchip" onClick={() => setSpostaScelto(s)}>{s}</button>
                  ))}
                </div>
              )}

              {spostaAperto === p.id && spostaScelto && (
                <div className="notaBox ambra" style={{ marginTop: 0, marginBottom: 14 }}>
                  <p><b>Spostare la sessione a {spostaScelto}?</b> Era fissata per {dataOrario}. Lo spostamento non tocca il tuo portafoglio.</p>
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button className="b b-blu" onClick={() => confermaSposta(p.id, spostaScelto)}>Conferma spostamento</button>
                    <button className="b b-ghost" onClick={chiudiSposta}>Annulla</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sessioniInSospeso.length > 0 && (
        <>
          <div className="stit"><span>Sessioni in sospeso</span></div>
          <div className="blocco">
            <p className="nota" style={{ marginTop: 0 }}>
              Ore congelate o addebitate che restano visibili finché non sono chiuse — nulla qui si
              perde in silenzio.
            </p>
            {sessioniInSospeso.map((p) => {
              const co = COACHES.find((c) => c.id === p.coachId);
              const dataOrario = p.orario.includes("·") ? p.orario : `${fmtData(p.data)} · ${p.orario}`;
              const inContestazione = p.stato === "contestazione";
              return (
                <div className="riga" key={p.id} style={{ flexDirection: "column", alignItems: "stretch", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <span>{dataOrario} · {co?.nome}</span>
                    <span className={`stato stato-${inContestazione ? "avviso" : "neutro"}`}>
                      {inContestazione ? "In contestazione" : "Cancellata · ora addebitata"}
                    </span>
                  </div>
                  {inContestazione && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button className="b b-ghost" style={{ fontSize: 12.5 }}
                              onClick={() => risolviContestazione(p.id, "no-show")}>
                        (demo) Conferma no-show: restituisce l'ora
                      </button>
                      <button className="b b-ghost" style={{ fontSize: 12.5 }}
                              onClick={() => risolviContestazione(p.id, "regolare")}>
                        (demo) Risolvi: sessione regolare
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="stit"><span>Gare che hai in programma</span></div>
      <div className="blocco">
        {garePianificate.length === 0 && (
          <p className="nota" style={{ marginTop: 0 }}>Non hai ancora selezionato gare dal calendario di stagione.</p>
        )}
        {garePianificate.map((g) => (
          <div className="riga" key={g.id}>
            <span><span className="dot" style={{ background: "var(--oro)" }} />{fmtData(g.data)} · {g.pista}</span>
            <span className="nn">{g.auto}</span>
          </div>
        ))}
        <button className="apri" onClick={() => setPickerAperto((v) => !v)}>
          {pickerAperto ? "▾ Chiudi il calendario di stagione" : "▸ Aggiungi una gara dal calendario di stagione"}
        </button>
        {pickerAperto && (
          <div style={{ marginTop: 4, borderTop: "1px solid var(--bordo)", paddingTop: 6 }}>
            {CALENDARIO_STAGIONE.map((g) => (
              <label className="riga" style={{ cursor: "pointer" }} key={g.id}>
                <span>
                  <input type="checkbox" checked={gareIds.includes(g.id)} onChange={() => toggleGara(g.id)}
                         style={{ marginRight: 10 }} />
                  {fmtData(g.data)} · {g.pista}
                </span>
                <span className="nn">{g.auto}</span>
              </label>
            ))}
            <p className="nota">Calendario di stagione provvisorio — verrà sostituito con quello ufficiale.</p>
          </div>
        )}
      </div>

      {/* 6. note & consigli del coach — archivio in lettura */}
      <div className="stit"><span>Note & consigli del coach</span></div>
      <div className="blocco" style={{ marginBottom: 40 }}>
        {note.length === 0 && <p className="nota" style={{ marginTop: 0 }}>Ancora nessuna nota.</p>}
        {note.map((n) => {
          const co = COACHES.find((c) => c.id === n.coachId);
          return (
            <div className="recens" key={n.id}>
              <div className="recmeta">
                <span>{co?.nome}</span><span>{fmtData(n.data)}</span>{n.pista && <span>· {n.pista}</span>}
                <span className={`origineTag ${n.origine === "coach" ? "coach" : ""}`}>
                  {n.origine === "coach" ? "Dal coach" : "Da chat"}
                </span>
              </div>
              <p>{n.testo}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------- AREA COACH -------------------------------- */

function AreaCoach() {
  const allievi = [
    { n: "L. Moretti", p: "Monza · Huracán", ir: 564, gg: 22, w: 82, s: "in regola · 19 gare" },
    { n: "S. Danieli", p: "Spa · Ferrari 296", ir: 318, gg: 35, w: 54, s: "in regola · 11 gare" },
    { n: "F. Curci", p: "Imola · Huracán", ir: 42, gg: 12, w: 12, s: "fermo da 9 giorni", warn: true },
  ];
  return (
    <div className="w">
      <div className="stit" style={{ marginTop: 26 }}><span>Il tuo punteggio</span><span>agg. 6 ore fa</span></div>
      <div className="kpigrid">
        <div className="kbox">
          <div className="klab">Mediana allievi</div>
          <div className="kval" style={{ color: "var(--blu2)" }}>+412 iR</div>
          <div className="ccsm" style={{ marginTop: 6 }}>in 30 giorni · 14 allievi tracciati</div>
        </div>
        <div className="kbox">
          <div className="klab">Incassato in agosto</div>
          <div className="kval">1.147 €</div>
          <div className="ccsm" style={{ marginTop: 6 }}>su 1.350 € lordi · 27 sessioni</div>
        </div>
      </div>

      <div className="avviso" style={{ marginTop: 20 }}>
        Un allievo non corre da 9 giorni. Sotto le otto gare mensili esce dal conteggio e il tuo
        punteggio scende senza che tu abbia sbagliato niente.
      </div>

      <div className="stit"><span>I tuoi allievi</span></div>
      {allievi.map((a) => (
        <div key={a.n} style={{ marginBottom: 16 }}>
          <div className="riga" style={{ borderBottom: 0, paddingBottom: 6 }}>
            <span>{a.n} <span className="nn">· {a.p}</span></span>
            <b className="mn" style={{ color: a.warn ? "var(--rosso2)" : "var(--blu2)" }}>+{a.ir} iR / {a.gg} gg</b>
          </div>
          <div style={{ height: 6, background: "var(--nero3)" }}>
            <i style={{ display: "block", height: "100%", width: a.w + "%", background: a.warn ? "var(--rosso2)" : "var(--blu)" }} />
          </div>
          <div className="ccsm" style={{ marginTop: 6, color: a.warn ? "var(--rosso2)" : undefined }}>{a.s}</div>
        </div>
      ))}

      <div className="stit"><span>Dove sei forte</span></div>
      <div className="blocco">
        <div className="riga"><span>Sotto 1.5k</span><b className="mn" style={{ color: "var(--blu2)" }}>+520 iR · 4 allievi</b></div>
        <div className="riga"><span>1.5k – 2.5k</span><b className="mn" style={{ color: "var(--blu2)" }}>+470 iR · 6 allievi</b></div>
        <div className="riga"><span>2.5k – 4k</span><b className="mn" style={{ color: "var(--blu2)" }}>+210 iR · 3 allievi</b></div>
        <div className="riga"><span>Sopra 4k</span><span className="nn">1 allievo · non mostrato</span></div>
        <p className="nota">
          Ti conviene farti trovare da chi parte sotto i 2.5k: è lì che i tuoi numeri parlano.
        </p>
      </div>

      <div className="stit"><span>Profilo pubblico</span></div>
      <div className="blocco" style={{ marginBottom: 40 }}>
        <div className="riga"><span>Account iRacing collegato</span><span className="mn" style={{ color: "var(--blu2)" }}>verificato</span></div>
        <div className="riga"><span>Sessione di prova</span><span className="mn" style={{ color: "var(--blu2)" }}>superata</span></div>
        <div className="riga"><span>Patto di risultato</span><span className="nn">non attivo</span></div>
        <div style={{ marginTop: 16 }}>
          <button className="b b-rosso">Modifica profilo</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ CANDIDATURA COACH ------------------------------ */

const FASCE_ORARIE = ["Feriali mattina", "Feriali pomeriggio", "Feriali sera", "Weekend giorno", "Weekend sera"];

function Candidatura({ chiudi, vaiLoginCoach }) {
  const [step, setStep] = useState(1); // 1 requisiti · 2 questionario · 3 conferma

  // cancello 1: requisiti automatici, verificati (in produzione) via account iRacing
  const [licenza, setLicenza] = useState("");
  const [anni, setAnni] = useState("");
  const [irMin, setIrMin] = useState("");
  const rispostoRequisiti = licenza !== "" && anni !== "" && irMin !== "";
  const requisitiOk = licenza === "A" && anni === "si" && irMin === "si";

  // cancello 2: questionario, 12 domande, revisione manuale
  const [r, setR] = useState({
    categoria: "", fascia: "", ore: "", fasceOrarie: FASCE_ORARIE.slice(0, 0), software: "",
    conduzione: "", postazione: "", q8: "", q9: "", q10: "", q11: "", q12: "",
  });
  const set = (k) => (e) => setR((prev) => ({ ...prev, [k]: e.target.value }));
  const toggleOraria = (v) =>
    setR((prev) => ({
      ...prev,
      fasceOrarie: prev.fasceOrarie.includes(v)
        ? prev.fasceOrarie.filter((x) => x !== v)
        : [...prev.fasceOrarie, v],
    }));

  const questionarioCompleto =
    r.categoria && r.fascia && r.ore && r.fasceOrarie.length > 0 && r.software &&
    r.conduzione && r.postazione && r.q8 && r.q9 && r.q10 && r.q11 && r.q12;

  if (step === 3)
    return (
      <div className="w">
        <button className="indietro" onClick={chiudi}>← Torna alla home</button>
        <div className="ok">
          <h2 style={{ fontSize: 24, color: "var(--blu2)" }}>Candidatura inviata</h2>
          <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.6 }}>
            Requisiti verificati, questionario ricevuto. Le risposte aperte le leggiamo a mano: se il
            profilo torna, ti scriviamo per fissare la prova.
          </p>
        </div>
        <div className="stit"><span>Stato candidatura</span></div>
        <div className="blocco" style={{ marginBottom: 40 }}>
          <div className="riga"><span>Requisiti automatici</span><b className="mn" style={{ color: "var(--blu2)" }}>superati</b></div>
          <div className="riga"><span>Questionario</span><b className="mn" style={{ color: "var(--blu2)" }}>in revisione</b></div>
          <div className="riga"><span>Prova reale · 30 minuti</span><span className="nn">in attesa di approvazione del questionario</span></div>
          <p className="nota">
            Appena il questionario è approvato lo stato passa a "in attesa di prova": una sessione da
            30 minuti in cui fai coaching a un pilota vero, non a noi.
          </p>
        </div>
      </div>
    );

  if (step === 2)
    return (
      <div className="w">
        <button className="indietro" onClick={() => setStep(1)}>← Torna ai requisiti</button>
        <div className="stit" style={{ marginTop: 8 }}><span>Candidatura coach · 2 di 3</span><span>Questionario</span></div>
        <p className="p" style={{ marginTop: 0 }}>
          12 domande. Le prime sono operative, le ultime aperte: al lancio le leggiamo di persona, non
          c'è un punteggio automatico.
        </p>

        <div className="campo">
          <label>1 · Categoria in cui vuoi fare coaching</label>
          <select value={r.categoria} onChange={set("categoria")}>
            <option value="">Seleziona…</option>
            <option value="coperte">Ruote coperte</option>
            <option value="scoperte">Ruote scoperte</option>
            <option value="entrambe">Entrambe</option>
          </select>
        </div>
        <div className="campo">
          <label>2 · Fascia di iRating a cui ti rivolgi</label>
          <select value={r.fascia} onChange={set("fascia")}>
            <option value="">Seleziona…</option>
            <option value="b1">Sotto 1.5k</option>
            <option value="b2">1.5k – 2.5k</option>
            <option value="b3">2.5k – 4k</option>
            <option value="b4">Sopra 4k</option>
            <option value="piu">Più di una</option>
          </select>
        </div>
        <div className="campo">
          <label>3 · Ore a settimana che puoi dedicare</label>
          <select value={r.ore} onChange={set("ore")}>
            <option value="">Seleziona…</option>
            <option value="sotto3">Sotto 3</option>
            <option value="3-6">3 – 6</option>
            <option value="6-12">6 – 12</option>
            <option value="oltre12">Oltre 12</option>
          </select>
        </div>
        <div className="campo">
          <label>4 · Fasce orarie in cui sei disponibile</label>
          <div className="checkgrid">
            {FASCE_ORARIE.map((v) => (
              <OpzioneCheck key={v} checked={r.fasceOrarie.includes(v)} onChange={() => toggleOraria(v)}>
                {v}
              </OpzioneCheck>
            ))}
          </div>
        </div>
        <div className="campo">
          <label>5 · Software che usi per la telemetria</label>
          <select value={r.software} onChange={set("software")}>
            <option value="">Seleziona…</option>
            <option value="motec">MoTeC</option>
            <option value="atlas">Atlas</option>
            <option value="ispeed">iSpeed</option>
            <option value="altro">Altro</option>
            <option value="nessuno">Nessuno</option>
          </select>
        </div>
        <div className="campo">
          <label>6 · Come conduci una sessione</label>
          <select value={r.conduzione} onChange={set("conduzione")}>
            <option value="">Seleziona…</option>
            <option value="live">Voce live in gara</option>
            <option value="telemetria">Analisi telemetria registrata</option>
            <option value="entrambi">Entrambi</option>
          </select>
        </div>
        <div className="campo">
          <label>7 · Hai una postazione da cui condividere schermo e telemetria in tempo reale?</label>
          <select value={r.postazione} onChange={set("postazione")}>
            <option value="">Seleziona…</option>
            <option value="si">Sì</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="campo">
          <label>8 · Descrivi come struttureresti la prima sessione con un pilota che non conosci.</label>
          <textarea value={r.q8} onChange={set("q8")} />
        </div>
        <div className="campo">
          <label>9 · Un allievo dopo tre sessioni non è migliorato. Cosa fai?</label>
          <textarea value={r.q9} onChange={set("q9")} />
        </div>
        <div className="campo">
          <label>10 · Un allievo vuole lavorare sulla velocità in curva, ma dai suoi dati vedi che perde
            soprattutto in staccata. Come gestisci la differenza tra quello che chiede e quello che gli serve?</label>
          <textarea value={r.q10} onChange={set("q10")} />
        </div>
        <div className="campo">
          <label>11 · Raccontaci un tuo limite come pilota e come l'hai affrontato.</label>
          <textarea value={r.q11} onChange={set("q11")} />
        </div>
        <div className="campo">
          <label>12 · Perché vuoi fare coaching su una piattaforma piccola e nuova invece che sul tuo Discord?</label>
          <textarea value={r.q12} onChange={set("q12")} />
        </div>

        <div style={{ margin: "16px 0 40px" }}>
          <button className="b b-rosso b-lg" style={{ width: "100%" }} disabled={!questionarioCompleto}
                  onClick={() => setStep(3)}>
            {questionarioCompleto ? "Invia candidatura" : "Rispondi a tutte le domande per continuare"}
          </button>
        </div>
      </div>
    );

  return (
    <div className="w">
      <button className="indietro" onClick={chiudi}>← Torna alla home</button>
      <div className="stit" style={{ marginTop: 8 }}><span>Candidatura coach · 1 di 3</span><span>Requisiti</span></div>
      <p className="p" style={{ marginTop: 0 }}>
        Tre condizioni verificate tramite il tuo account iRacing. Da sole determinano se puoi
        candidarti: non bloccano una singola prenotazione, quello lo fa la forbice di livello con
        ogni pilota.
      </p>

      <div className="filtri">
        <div className="fhead"><span>Requisiti</span><span>Verificati su iRacing</span></div>
        <div className="frow">
          <label htmlFor="rl">Licenza</label>
          <select id="rl" value={licenza} onChange={(e) => setLicenza(e.target.value)}>
            <option value="">Seleziona…</option>
            <option value="A">Licenza A</option>
            <option value="altra">Licenza B, C o D</option>
          </select>
        </div>
        <div className="frow">
          <label htmlFor="ra">Account ≥ 3 anni</label>
          <select id="ra" value={anni} onChange={(e) => setAnni(e.target.value)}>
            <option value="">Seleziona…</option>
            <option value="si">Sì, da almeno 3 anni</option>
            <option value="no">No, meno di 3 anni</option>
          </select>
        </div>
        <div className="frow">
          <label htmlFor="ri">iRating ≥ 3.000</label>
          <select id="ri" value={irMin} onChange={(e) => setIrMin(e.target.value)}>
            <option value="">Seleziona…</option>
            <option value="si">Sì, 3.000 o più</option>
            <option value="no">No, sotto i 3.000</option>
          </select>
        </div>
      </div>

      {rispostoRequisiti && !requisitiOk && (
        <div className="notaBox rossa">
          <p>
            <b>Non soddisfi ancora i requisiti minimi.</b> Servono licenza A, almeno 3 anni di account
            iRacing e un iRating minimo di 3.000 per candidarsi come coach su CORDA. Puoi ricandidarti
            appena li raggiungi.
          </p>
        </div>
      )}

      {requisitiOk && (
        <div style={{ margin: "20px 0 40px" }}>
          <button className="b b-rosso b-lg" style={{ width: "100%" }} onClick={() => setStep(2)}>
            Continua al questionario
          </button>
        </div>
      )}

      <p className="nota">
        Hai già un profilo attivo? <button className="apri" style={{ display: "inline", padding: 0 }}
          onClick={vaiLoginCoach}>Accedi</button>
      </p>
    </div>
  );
}

/* ---------------------------------- APP ---------------------------------- */

export default function App() {
  const [pagina, setPagina] = useState("home"); // home | login | app | candidatura
  const [ruolo, setRuolo] = useState("pilota");
  const [tab, setTab] = useState("cerca");
  const [coach, setCoach] = useState(null);
  const [note, setNote] = useState(PERCORSO.note);
  const [chatCoachId, setChatCoachId] = useState(""); // "" = nessuna chat aperta
  const [chatMessaggi, setChatMessaggiRaw] = useState(CHAT_THREADS); // { [coachId]: [...] }, condiviso: non si perde uscendo dalla chat
  const [chatLettiSnapshot, setChatLettiSnapshot] = useState({}); // { [coachId]: n. messaggi coach già letti l'ultima apertura }
  const [notificheEmail, setNotificheEmail] = useState(true); // punto 1: preferenza disattivabile
  const [bannerChiuso, setBannerChiuso] = useState({}); // { [coachId]: conteggio al momento della chiusura del banner }
  const [iracingCollegato, setIracingCollegato] = useState(false); // punto 2
  // "" = la palette di base in .crd{} ("La traiettoria", l'unica identità
  // pubblica). Gli altri quattro nomi (più "attuale", il giro precedente)
  // restano nel codice come strumento di sviluppo nascosto: niente
  // selettore in header, si raggiungono solo con ?tema=nome nell'URL —
  // il colore deve poter portare significato con UNA sola palette, non
  // funzionare con cinque in contemporanea.
  const [tema, setTema] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("tema") || "";
  });

  // iR del pilota per il matching: non e' piu' un filtro manuale, arriva
  // dall'account iRacing collegato (mock). Senza collegamento non c'e' un
  // iR verificato, quindi Cerca/Scheda spengono gli stati Consigliato/
  // Neutro/Avviso invece di calcolarli su un valore assunto
  const mia = iracingCollegato ? fasciaDaIr(PILOTA_DEMO.ir) : "b2";
  const miaIr = iracingCollegato ? String(PILOTA_DEMO.ir) : "";

  /* ---------------- portafoglio ore: stato condiviso, per coach ----------------
     Un'ora vale solo con il coach da cui è stata comprata: niente saldo unico,
     niente travaso tra coach. La mappa è coachId -> { disponibili,
     acquistateTotali }; ogni operazione riceve un coachId e tocca solo quella
     voce. Lifted qui (non su Percorso) perché Scheda (alloca prenotando),
     Percorso (mostra/gestisce) e AcquistoOre (accredita) sono fratelli:
     nessuno dei tre da solo può tenere questo stato.
     Il tetto di TETTO_ORE_MENSILI resta per persona, sommato su tutti i
     coach — non per singolo coach — quindi si controlla sul totale
     (oreDisponibiliTotali), non sulla singola voce della mappa. */
  const [walletPerCoach, setWalletPerCoach] = useState(() => ({
    [PERCORSO.coachAttualeId]: { disponibili: PERCORSO.oreResidue, acquistateTotali: PERCORSO.oreAcquistate },
  }));
  const [prenotazioni, setPrenotazioni] = useState(() =>
    PERCORSO.prenotazioni.map((p) => ({ ...p, ore: DURATA_SESSIONE_ORE, stato: "allocata" })));
  const [sessioniTotali, setSessioniTotali] = useState(PERCORSO.sessioniTotali);
  const [acquisto, setAcquisto] = useState(null); // { coach, offerta } quando l'acquisto e' in corso
  const [calendarioCoach, setCalendarioCoach] = useState(null); // coach il cui calendario di allocazione e' aperto, o null

  const walletDi = (coachId) => walletPerCoach[coachId] || { disponibili: 0, acquistateTotali: 0 };
  const oreDisponibiliTotali = Object.values(walletPerCoach).reduce((s, w) => s + anyOf(w).disponibili, 0);
  const oreAllocateDi = (coachId) =>
    prenotazioni.filter((p) => p.coachId === coachId && p.stato === "allocata").reduce((s, p) => s + p.ore, 0);

  const apriAcquistoOre = (coach, offerta) => setAcquisto(anyOf({ coach, offerta }));
  const chiudiAcquistoOre = () => setAcquisto(null);
  const apriCalendarioAllocazione = (coach) => setCalendarioCoach(anyOf(coach));
  const chiudiCalendarioAllocazione = () => setCalendarioCoach(null);

  const rimborsaCoach = (coachId, ore) =>
    setWalletPerCoach((prev) => {
      const attuale = prev[coachId] || { disponibili: 0, acquistateTotali: 0 };
      return { ...prev, [coachId]: { ...attuale, disponibili: attuale.disponibili + ore } };
    });

  // successo pagamento (simulato): accredita SOLO il coach dell'offerta
  // comprata, rispettando comunque il tetto totale (anche se il riepilogo lo
  // blocca già prima di arrivare qui). prezzo non serve al saldo ma resta
  // nella firma: e' quello che un vero Stripe manderebbe insieme alla conferma
  const accreditaOre = (coachId, ore, prezzo) => {
    setWalletPerCoach((prev) => {
      const totaleAttuale = Object.values(prev).reduce((s, w) => s + anyOf(w).disponibili, 0);
      const oreEffettive = Math.max(0, Math.min(ore, TETTO_ORE_MENSILI - totaleAttuale));
      const attuale = prev[coachId] || { disponibili: 0, acquistateTotali: 0 };
      return {
        ...prev,
        [coachId]: { disponibili: attuale.disponibili + oreEffettive, acquistateTotali: attuale.acquistateTotali + oreEffettive },
      };
    });
  };

  // allocare N slot dal calendario in un colpo solo: scala subito dal
  // portafoglio DI QUEL COACH. false se il saldo con quel coach non basta
  // per tutti gli slot scelti (il tetto mensile e' gia' rispettato per
  // costruzione: walletOre non puo' mai superarlo, vedi accreditaOre) —
  // cosi' CalendarioAllocazione sa di non mostrare lo step "successo"
  const allocaSlot = (coach, slots) => {
    if (slots.length === 0) return false;
    if (walletDi(coach.id).disponibili < slots.length) return false;
    setWalletPerCoach((prev) => ({
      ...prev,
      [coach.id]: { ...prev[coach.id], disponibili: prev[coach.id].disponibili - slots.length },
    }));
    setPrenotazioni((prev) => [
      ...prev,
      ...slots.map((s, i) => ({
        id: `p-${Date.now()}-${i}`, data: s.giornoIso,
        coachId: coach.id, orario: s.oraLabel, ore: DURATA_SESSIONE_ORE, stato: "allocata",
      })),
    ]);
    return true;
  };

  // spostare non tocca il saldo: muove solo lo slot
  const spostaSessione = (id, nuovoSlot) =>
    setPrenotazioni((prev) => prev.map((p) => (p.id === id ? { ...p, orario: nuovoSlot } : p)));

  // cancellare: rimborso pieno al portafoglio DI QUEL COACH solo con piu' di
  // FINESTRA_CANCELLAZIONE_ORE di preavviso (e il coach non viene pagato);
  // sotto quella soglia l'ora resta scalata e il coach viene comunque pagato
  // per lo slot bloccato
  const cancellaSessione = (id) => {
    const p = prenotazioni.find((x) => x.id === id);
    if (!p) return;
    if (oreAllaSessione(p) >= FINESTRA_CANCELLAZIONE_ORE) {
      rimborsaCoach(p.coachId, p.ore);
      setPrenotazioni((prev) => prev.filter((x) => x.id !== id));
    } else {
      setPrenotazioni((prev) => prev.map((x) => (x.id === id ? { ...x, stato: "cancellata-addebitata" } : x)));
    }
  };

  // sospendere un coach = cancellare tutte le sue sessioni allocate, con la
  // stessa regola di rimborso della cancellazione singola
  const sospendiTuttoConCoach = (coachId) => {
    prenotazioni
      .filter((p) => p.coachId === coachId && p.stato === "allocata")
      .forEach((p) => cancellaSessione(p.id));
  };

  // no-show del coach: verifica manuale in questo giro (la stanza sessione
  // non traccia ancora le presenze). L'ora resta congelata, ne' persa ne'
  // restituita, finche' non si risolve la contestazione
  const segnalaNoShow = (id) =>
    setPrenotazioni((prev) => prev.map((p) => (p.id === id ? { ...p, stato: "contestazione" } : p)));

  // risolve una contestazione aperta — oggi cliccato a mano dal pilota per la
  // demo, ma è la stessa funzione che va richiamata in automatico appena la
  // stanza sessione saprà dire "pilota presente, coach assente" da sola
  const risolviContestazione = (id, esito) => {
    const p = prenotazioni.find((x) => x.id === id);
    if (!p) return;
    if (esito === "no-show") rimborsaCoach(p.coachId, p.ore); // restituzione piena, il coach non viene pagato
    setPrenotazioni((prev) => prev.filter((x) => x.id !== id));
  };

  const onTerminaSessione = (id) => {
    setSessioniTotali((n) => n + 1);
    setPrenotazioni((prev) => prev.map((p) => (p.id === id ? { ...p, stato: "svolta" } : p)));
  };

  useEffect(() => { window.scrollTo(0, 0); }, [pagina, tab, coach, chatCoachId]);

  const vaiLogin = (r) => { setRuolo(r); setPagina("login"); };
  const vaiCandidatura = () => setPagina("candidatura");
  const entra = () => { setPagina("app"); setTab(ruolo === "coach" ? "dash" : "cerca"); setCoach(null); };
  const esci = () => { setPagina("home"); setCoach(null); };

  const aggiornaMessaggi = (coachId, updater) =>
    setChatMessaggiRaw((prev) => ({ ...prev, [coachId]: updater(prev[coachId] || []) }));

  const apriChat = (coachId) => {
    setChatCoachId(coachId);
    const totaleCoach = (chatMessaggi[coachId] || []).filter((m) => m.da === "coach").length;
    setChatLettiSnapshot((prev) => ({ ...prev, [coachId]: totaleCoach }));
  };
  const nonLettiPer = (coachId) => nonLettiDi(coachId, chatMessaggi, chatLettiSnapshot);

  // demo: simula l'arrivo di un messaggio dal coach mentre il pilota non ha
  // quella chat aperta — serve a mostrare badge + email raggruppata (punto 1)
  const simulaMessaggioCoach = (coachId, testo) => {
    aggiornaMessaggi(coachId, (prev) => [
      ...prev,
      { id: `sim-${Date.now()}`, da: "coach", testo, quando: new Date().toISOString(), letto: false },
    ]);
    inviaPushNotifica(coachId, testo); // gancio per dopo, oggi non fa nulla
  };

  // il coach con un'email (mock) ancora da mostrare: notifiche attive, non
  // letto sopra quanto già chiuso per quel thread — un solo banner alla volta
  const coachDaNotificare = notificheEmail
    ? COACHES.find((c) => nonLettiPer(c.id) > (bannerChiuso[c.id] || 0))
    : undefined;
  const chiudiBanner = (coachId) => setBannerChiuso((prev) => ({ ...prev, [coachId]: nonLettiPer(coachId) }));

  return (
    <div className="crd" data-theme={tema}>
      <style>{CSS}</style>

      <header className="nav">
        <div className="w navin">
          <button className="brand" onClick={esci}>CORD<i>A</i></button>
          {pagina === "app" && ruolo === "pilota" && (
            <button className="identita" onClick={() => { setTab("scheda"); setCoach(null); }}>
              <b>{PILOTA_DEMO.nome}</b>{" "}
              {iracingCollegato
                ? <>· {PILOTA_DEMO.ir} iR <span className="irTag ok">Verificato</span></>
                : <span className="irTag">Collega iRacing</span>}
            </button>
          )}
          {pagina === "home" && (
            <nav className="navlinks">
              <button onClick={() => document.getElementById("come")?.scrollIntoView({ behavior: "smooth" })}>
                Come funziona
              </button>
              <button onClick={vaiCandidatura}>Per i coach</button>
            </nav>
          )}
          <div className="navcta">
            {pagina === "app" ? (
              <button className="b b-ghost" onClick={esci}>Esci</button>
            ) : (
              <>
                <button className="b b-ghost" onClick={() => vaiLogin("pilota")}>Accedi</button>
                <button className="b b-rosso" onClick={() => vaiLogin("pilota")}>Inizia</button>
              </>
            )}
          </div>
        </div>
      </header>

      {pagina === "home" && <Home vaiLogin={vaiLogin} vaiCandidatura={vaiCandidatura} />}
      {pagina === "login" && <Login ruolo={ruolo} setRuolo={setRuolo} entra={entra} />}
      {pagina === "candidatura" && <Candidatura chiudi={esci} vaiLoginCoach={() => vaiLogin("coach")} />}

      {pagina === "app" && (
        <>
          <div className="appbar">
            <div className="w appbarin">
              {ruolo === "pilota" ? (
                <>
                  <button data-on={tab === "cerca" ? "1" : "0"} onClick={() => { setTab("cerca"); setCoach(null); }}>Cerca coach</button>
                  <button data-on={tab === "percorso" ? "1" : "0"} onClick={() => { setTab("percorso"); setCoach(null); }}>Il mio percorso</button>
                  <button className="schedaTab" data-on={tab === "scheda" ? "1" : "0"}
                          onClick={() => { setTab("scheda"); setCoach(null); }}>Scheda Pilota</button>
                </>
              ) : (
                <>
                  <button data-on="1">Area coach</button>
                  <span className="esci">Marco Bertolini</span>
                </>
              )}
            </div>
          </div>

          {ruolo === "pilota" && coachDaNotificare && (
            <div className="emailBanner">
              <div className="w emailBannerin">
                <span>
                  📧 <b>(demo)</b> Email inviata: hai {nonLettiPer(coachDaNotificare.id)} nuov
                  {nonLettiPer(coachDaNotificare.id) === 1 ? "o messaggio" : "i messaggi"} da {coachDaNotificare.nome}.
                </span>
                <button className="apriBanner" onClick={() => { apriChat(coachDaNotificare.id); setTab("percorso"); }}>Apri</button>
                <button className="chiudiBanner" onClick={() => chiudiBanner(coachDaNotificare.id)} aria-label="Chiudi">×</button>
              </div>
            </div>
          )}

          {ruolo === "pilota" && chatCoachId && (
            <Chat coachId={chatCoachId} chiudi={() => setChatCoachId("")} note={note} setNote={setNote}
                  messaggi={chatMessaggi} setMessaggi={aggiornaMessaggi}
                  notificheEmail={notificheEmail} setNotificheEmail={setNotificheEmail} />
          )}
          {ruolo === "pilota" && !chatCoachId && acquisto && (
            <AcquistoOre coach={anyOf(acquisto).coach} offerta={anyOf(acquisto).offerta}
                         walletCoach={walletDi(anyOf(acquisto).coach.id).disponibili}
                         oreDisponibiliTotali={oreDisponibiliTotali}
                         onSuccesso={(ore, prezzo) => accreditaOre(anyOf(acquisto).coach.id, ore, prezzo)}
                         onChiudi={chiudiAcquistoOre} />
          )}
          {ruolo === "pilota" && !chatCoachId && !acquisto && calendarioCoach && (
            <CalendarioAllocazione coach={calendarioCoach}
                       walletOre={walletDi(anyOf(calendarioCoach).id).disponibili}
                       prenotazioni={prenotazioni} fusoPilota={FUSO_PILOTA_DEFAULT}
                       onConferma={allocaSlot} chiudi={chiudiCalendarioAllocazione}
                       vaiPercorso={() => { chiudiCalendarioAllocazione(); setCoach(null); setTab("percorso"); }} />
          )}
          {ruolo === "pilota" && !chatCoachId && !acquisto && !calendarioCoach && tab === "cerca" && (coach
            ? <Scheda c={coach} mia={mia} miaIr={miaIr} iracingCollegato={iracingCollegato}
                       walletOre={walletDi(anyOf(coach).id).disponibili}
                       apriAcquistoOre={apriAcquistoOre} apriCalendario={apriCalendarioAllocazione}
                       chiudi={() => setCoach(null)}
                       vaiPercorso={() => { setCoach(null); setTab("percorso"); }} vediCoach={setCoach}
                       apriChat={apriChat} nonLettiDi={nonLettiPer} />
            : <Cerca apri={setCoach} mia={mia} miaIr={miaIr}
                      iracingCollegato={iracingCollegato} setIracingCollegato={setIracingCollegato} />)}
          {ruolo === "pilota" && !chatCoachId && !acquisto && !calendarioCoach && tab === "percorso" && (
            <Percorso vaiScheda={(co) => { setCoach(co); setTab("cerca"); }}
                      apriChat={apriChat} nonLettiDi={nonLettiPer} note={note} setNote={setNote}
                      iracingCollegato={iracingCollegato} setIracingCollegato={setIracingCollegato}
                      simulaMessaggioCoach={simulaMessaggioCoach}
                      walletPerCoach={walletPerCoach} oreDisponibiliTotali={oreDisponibiliTotali}
                      oreAllocateDi={oreAllocateDi}
                      prenotazioni={prenotazioni} sessioniTotali={sessioniTotali}
                      spostaSessione={spostaSessione} cancellaSessione={cancellaSessione}
                      sospendiTuttoConCoach={sospendiTuttoConCoach} segnalaNoShow={segnalaNoShow}
                      risolviContestazione={risolviContestazione} onTerminaSessione={onTerminaSessione}
                      apriAcquistoOre={apriAcquistoOre} apriCalendario={apriCalendarioAllocazione} />
          )}
          {ruolo === "pilota" && !chatCoachId && !acquisto && !calendarioCoach && tab === "scheda" && (
            <SchedaPilota vaiPercorso={() => setTab("percorso")}
                          iracingCollegato={iracingCollegato} setIracingCollegato={setIracingCollegato} />
          )}
          {ruolo === "coach" && <AreaCoach />}
        </>
      )}
    </div>
  );
}

