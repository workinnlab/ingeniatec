document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');
    let isTyping = false;

    // Mantener el enfoque en el input si hacen click en el área de la terminal
    terminalHistory.addEventListener('click', () => {
        if (!isTyping) terminalInput.focus();
    });

    terminalInput.addEventListener('keydown', function(event) {
        if (isTyping && event.key === 'Enter') {
            event.preventDefault();
            return;
        }
        if (event.key === 'Enter') {
            const rawCommand = this.value;
            const command = rawCommand.trim();
            this.value = ''; // Limpiar el input

            if (command) {
                processCommand(command, rawCommand);
            } else {
                // Solo agregar nueva linea con prompt vacío
                appendLine(`<span class="terminal-prompt">$</span><span class="terminal-command"></span>`);
            }
        }
    });

    function processCommand(command, rawCommand) {
        // Mostrar el comando escrito por el usuario
        appendLine(`<span class="terminal-prompt">$</span> <span class="terminal-command">${rawCommand}</span>`);

        const cmdParts = command.split(' ');
        const mainCmd = cmdParts[0].toLowerCase();
        let output = '';

        switch (mainCmd) {
            case 'help':
                output = `<span class="text-gradient">Comandos disponibles:</span>
<br>&nbsp;&nbsp;<span class="text-gradient-primary">whoami</span>    - Información del semillero
<br>&nbsp;&nbsp;<span class="text-gradient-primary">cat</span>       - Muestra el contenido de un archivo (ej: cat areas.txt)
<br>&nbsp;&nbsp;<span class="text-gradient-primary">cd</span>        - Navega a una sección (ej: cd nosotros, cd equipo)
<br>&nbsp;&nbsp;<span class="text-gradient-primary">clear</span>     - Limpia la terminal
<br>&nbsp;&nbsp;<span class="text-gradient-primary">date</span>      - Muestra la fecha actual
<br>&nbsp;&nbsp;<span class="text-gradient-primary">echo</span>      - Repite el texto escrito
<br>&nbsp;&nbsp;<span class="text-gradient-primary">./iniciar</span> - Ejecuta iniciar_proyecto.sh`;
                break;

            case 'whoami':
                output = `INGENIATEC - Semillero de Investigación`;
                break;

            case 'cat':
                if (cmdParts[1] === 'areas.txt') {
                    output = `[<span class="text-gradient">Impresión 3D</span>, <span class="text-gradient">Electrónica</span>, <span class="text-gradient">Robótica</span>, <span class="text-gradient">Software</span>]`;
                } else if (cmdParts[1] === 'secreto.txt') {
                    output = `cat: secreto.txt: <span style="color: #ff5f57;">Permiso denegado. Nivel de seguridad 5 requerido.</span>`;
                } else if (!cmdParts[1]) {
                    output = `cat: falta nombre del archivo. Intenta: cat areas.txt`;
                } else {
                    output = `cat: ${cmdParts[1]}: No existe el archivo o directorio`;
                }
                break;
                
            case './iniciar':
            case './iniciar_proyecto.sh':
                output = `🚀 Innovando desde WorkingLab - CUA`;
                break;

            case 'clear':
                // Se conservará solo la línea de entrada (la última que es id="terminal-input-line")
                const lines = Array.from(terminalHistory.children);
                lines.forEach(line => {
                    if (line.id !== 'terminal-input-line') {
                        line.remove();
                    }
                });
                return; // salir para evitar ageregar output vacío o salto

            case 'date':
                output = new Date().toString();
                break;

            case 'echo':
                output = command.substring(5); // Remueve "echo "
                break;

            case 'ls':
                output = `<span class="text-gradient">areas.txt</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-gradient-primary">iniciar_proyecto.sh</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-gradient-secondary">secreto.txt</span>`;
                break;

            case 'sudo':
                output = `[sudo] password for guest: <br><span style="color: #ff5f57;">Acceso denegado. Este incidente será reportado al Administrador del Semillero.</span>`;
                break;

            case 'ping':
                output = `Haciendo ping a workinglab.americana.edu.co con 32 bytes de datos:<br>
Respuesta desde 192.168.1.100: bytes=32 tiempo=14ms TTL=54<br>
Respuesta desde 192.168.1.100: bytes=32 tiempo=12ms TTL=54<br>
Respuesta desde 192.168.1.100: bytes=32 tiempo=13ms TTL=54<br>
Estadísticas de ping:<br>
&nbsp;&nbsp;&nbsp;&nbsp;Paquetes: enviados = 3, recibidos = 3, perdidos = 0 (0% perdidos)`;
                break;

            case 'hack':
                let hackOutput = `<span style="color: var(--accent-cyan)">Iniciando secuencia de infiltración...</span><br>`;
                hackOutput += `[OK] Bypass del firewall de WorkingLab completado.<br>`;
                hackOutput += `[OK] Resolviendo encriptación cuántica...<br>`;
                hackOutput += `[OK] Descargando planos de robots clasificados...<br>`;
                hackOutput += `<span style="color: var(--accent-pink)">¡Es broma! 😉 Bienvenido a INGENIATEC. ¡Únete a nosotros para aprender a construir tecnología real!</span>`;
                output = hackOutput;
                break;

            case 'matrix':
                output = `<span style="color: #28c840;">Wake up, Neo...<br>The Matrix has you...<br>Follow the white rabbit.</span>`;
                break;

            case 'cd':
                const section = cmdParts[1];
                if (section) {
                    const el = document.getElementById(section);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                        output = `Navegando a /${section}...`;
                    } else if (section === '..') {
                        output = ``;
                    } else {
                        output = `cd: ${section}: No such directory or section`;
                    }
                } else {
                    output = `cd: falta directorio de destino. Secciones disponibles: nosotros, equipo, lineas, galeria, workinglab, contacto`;
                }
                break;

            default:
                output = `Comando no encontrado: ${mainCmd}. Escribe '<span class="text-gradient-primary">help</span>' para ver los comandos disponibles.`;
        }

        if (output) {
            appendLine(`<span class="terminal-text">${output}</span>`, 'terminal-output', true);
        }
    }

    function appendLine(content, extraClass = '', typewrite = false) {
        const lineDiv = document.createElement('div');
        lineDiv.className = `terminal-line ${extraClass} mt-2`;
        
        const inputLine = document.getElementById('terminal-input-line');
        if (!inputLine) return;

        terminalHistory.insertBefore(lineDiv, inputLine);
        terminalHistory.scrollTop = terminalHistory.scrollHeight;

        if (typewrite) {
            isTyping = true;
            terminalInput.readOnly = true;
            let i = 0;
            lineDiv.innerHTML = '';
            
            function type() {
                if (i < content.length) {
                    if (content.charAt(i) === '<') {
                        let tagEnd = content.indexOf('>', i);
                        if (tagEnd !== -1) {
                            lineDiv.innerHTML = content.substring(0, tagEnd + 1);
                            i = tagEnd + 1;
                        } else {
                            lineDiv.innerHTML = content.substring(0, i + 1);
                            i++;
                        }
                    } else if (content.charAt(i) === '&') {
                        let entityEnd = content.indexOf(';', i);
                        if (entityEnd !== -1 && entityEnd < i + 10) {
                            lineDiv.innerHTML = content.substring(0, entityEnd + 1);
                            i = entityEnd + 1;
                        } else {
                            lineDiv.innerHTML = content.substring(0, i + 1);
                            i++;
                        }
                    } else {
                        lineDiv.innerHTML = content.substring(0, i + 1);
                        i++;
                    }
                    
                    terminalHistory.scrollTop = terminalHistory.scrollHeight;
                    // Velocidad de escritura tipo terminal realista (entre 5ms y 25ms)
                    const speed = Math.random() * 20 + 5;
                    setTimeout(type, speed);
                } else {
                    isTyping = false;
                    terminalInput.readOnly = false;
                    terminalInput.focus();
                }
            }
            type();
        } else {
            lineDiv.innerHTML = content;
            terminalHistory.scrollTop = terminalHistory.scrollHeight;
        }
    }
});
