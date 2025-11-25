// Fonctions utilitaires réutilisables
class SimulationUtils {
    static calculateCanvasSize(baseWidth, baseHeight, maxWidth = 800) {
        const fullWidth = window.innerWidth > maxWidth ? maxWidth : window.innerWidth * .95;
        const maxHeight = window.innerHeight * 0.6;
        const widthRatio = fullWidth / baseWidth;
        const heightRatio = maxHeight / baseHeight;
        const scaleFactor = Math.min(widthRatio, heightRatio, 1);
        
        return {
            width: baseWidth * scaleFactor,
            height: baseHeight * scaleFactor,
            scale: scaleFactor
        };
    }

    static setupButtonEvents(buttonsConfig) {
        buttonsConfig.forEach(button => {
            const element = document.getElementById(button.id);
            if (element) {
                element.addEventListener('click', button.handler);
                element.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    button.handler();
                });
            }
        });
    }

    static setupModalEvents() {
        document.querySelectorAll('.closeBtn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').classList.remove('active');
            });
        });
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        });
    }

    static drawAnswers(reponse, valeurs) {
        let txt = "";
        if (reponse) {
            txt += "GT = " + Math.round(valeurs.gisement) + "°<br>";
            txt += "QDM = " + Math.round(valeurs.QDMvrai) + "°<br>";
            txt += "QDR = " + Math.round(valeurs.QDRvrai) + "°<br>";
            txt += "Cap = " + Math.round(valeurs.cap) + "°";
        } else {
            txt += "GT = ?<br>QDM = ?<br>QDR = ?<br>Cap = ?";
        }
        document.getElementById('reponsesBox').innerHTML = txt;
    }
}