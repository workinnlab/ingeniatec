document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');
    let isTyping = false;

    // Mantener el enfoque en el input si hacen click en el área de la terminal
    terminalHistory.addEventListener('click', () => {
        if (!isTyping) terminalInput.focus();
    });

    terminalInput.addEventListener('keydown', function (event) {
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
                appendLine(`<span class="terminal-prompt">user@host:~$</span><span class="terminal-command"></span>`);
            }
        }
    });

    function processCommand(command, rawCommand) {
        // Mostrar el comando escrito por el usuario
        appendLine(`<span class="terminal-prompt">user@host:~$</span> <span class="terminal-command">${rawCommand}</span>`);

        const cmdParts = command.split(' ');
        const mainCmd = cmdParts[0].toLowerCase();
        let output = '';

        switch (mainCmd) {
            case 'help':
                output = `<span class="text-gradient-primary">Comandos Disponibles:</span>
<br>&nbsp;&nbsp;<span class="text-gradient-primary">whoami</span>    - Muestra quiénes somos
<br>&nbsp;&nbsp;<span class="text-gradient-primary">cat</span>       - Lee archivos (ej: cat areas.txt)
<br>&nbsp;&nbsp;<span class="text-gradient-primary">ls</span>        - Lista secciones del sitio
<br>&nbsp;&nbsp;<span class="text-gradient-primary">cd</span>        - Navega a una sección (ej: cd nosotros)
<br>&nbsp;&nbsp;<span class="text-gradient-primary">clear</span>     - Limpia la pantalla
<br>&nbsp;&nbsp;<span class="text-gradient-primary">reboot</span>    - Reinicia la terminal (vuelve al inicio)
<br>&nbsp;&nbsp;<span class="text-gradient-primary">credits</span>   - Muestra los créditos del sitio (SPEC)
<br>&nbsp;&nbsp;<span class="text-gradient-primary">1337</span>      - Activa/Desactiva el Modo Hacker
<br>&nbsp;&nbsp;<span class="text-gradient-primary">npm</span>       - Gestor de paquetes (ej: npm install love)
<br>&nbsp;&nbsp;<span class="text-gradient-primary">vim</span>       - Intenta salir de este editor
<br>&nbsp;&nbsp;<span class="text-gradient-primary">neofetch</span>  - Información del sistema
<br>&nbsp;&nbsp;<span class="text-gradient-primary">hack</span>      - Secuencia especial de infiltración
<br>&nbsp;&nbsp;<span class="text-gradient-primary">matrix</span>    - Despierta y entra a la matrix`;
                break;

            case 'whoami':
                output = `INGENIATEC - Semillero de Investigación`;
                break;

            case 'cat':
                const fileName = (cmdParts[1] || '').toLowerCase();
                if (fileName === 'areas.txt') {
                    output = `<span class="terminal-text">[</span><span class="text-gradient">Impresión 3D</span><span class="terminal-text">,</span><span class="text-gradient">Electrónica</span><span class="terminal-text">,</span><span class="text-gradient">Robótica</span><span class="terminal-text">,</span><span class="text-gradient">Software</span><span class="terminal-text">]</span>`;
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
                output = `🚀 Innovando desde WorkInnLab - CUA`;
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
                output = `Haciendo ping a workinnlab.americana.edu.co con 32 bytes de datos:<br>
Respuesta desde 192.168.1.100: bytes=32 tiempo=14ms TTL=54<br>
Respuesta desde 192.168.1.100: bytes=32 tiempo=12ms TTL=54<br>
Respuesta desde 192.168.1.100: bytes=32 tiempo=13ms TTL=54<br>
Estadísticas de ping:<br>
&nbsp;&nbsp;&nbsp;&nbsp;Paquetes: enviados = 3, recibidos = 3, perdidos = 0 (0% perdidos)`;
                break;

            case 'hack':
                let hackOutput = `<span style="color: var(--accent-cyan)">Iniciando secuencia de infiltración...</span><br>`;
                hackOutput += `[OK] Bypass del firewall de WorkInnLab completado.<br>`;
                hackOutput += `[OK] Resolviendo encriptación cuántica...<br>`;
                hackOutput += `[OK] Descargando planos de robots clasificados...<br>`;
                hackOutput += `<span style="color: var(--accent-pink)">¡Es broma! 😉 Bienvenido a INGENIATEC. ¡Únete a nosotros para aprender a construir tecnología real!</span>`;
                output = hackOutput;
                break;

            case 'matrix':
                output = `<span style="color: #28c840;">Wake up, Neo...<br>The Matrix has you...<br>Follow the white rabbit.</span>`;
                break;

            case 'neofetch':
                output = `<span style="color: var(--accent-cyan); white-space: pre-wrap;">
   /\\       OS: IngeniaOS 25.04
  /  \\      Kernel: Innovación-Core-5.1
 /____\\     CPU: Mentes Brillantes CUA
/      \\    RAM: Pasión Ilimitada
</span>`;
                break;

            case 'rm':
                if (command.includes('-rf /')) {
                    output = `<span style="color: #ff5f57;">¡Whoa, detente ahí! Casi borras todo el servidor del WorkInnLab. Menos mal que le pusimos protección contra novatos. 😅</span>`;
                } else {
                    output = `rm: falta operando`;
                }
                break;

            case 'make':
                if (command.includes('me a sandwich')) {
                    output = `Error: Hazlo tú mismo. O mejor, usa una de nuestras impresoras 3D en el laboratorio para imprimir uno... aunque quizás quede algo duro.`;
                } else {
                    output = `make: *** No targets specified and no makefile found.  Stop.`;
                }
                break;

            case 'coffee':
            case 'brew':
                output = `<span style="color: #febc2e;">Error 418: I'm a teapot (Soy una tetera). Pero te sugiero ir por un buen café a la cafetería para seguir investigando y programando. ☕</span>`;
                break;

            case 'print':
                if (cmdParts[1] === '3d') {
                    output = `Cargando archivo STL...<br>Calentando extrusor a 210°C...<br>Imprimiendo: [=========&gt; ] 90%...<br><span style="color: #ff5f57;">¡Error! Falta filamento PLA. Contacte al equipo del WorkInnLab.</span>`;
                } else {
                    output = `Imprimiendo nada. Intenta 'print 3d'.`;
                }
                break;

            case '42':
                output = `<span style="color: var(--primary);">La respuesta a la vida, el universo y todo lo demás. Lo difícil es encontrar la pregunta correcta, ¡para eso investigamos en INGENIATEC!</span>`;
                break;

            case 'git':
                if (command.includes('push --force')) {
                    output = `<span style="color: #ff5f57;">¿Estás seguro de querer sobrescribir el trabajo de todo el equipo de Software? Esperemos que tengas un buen sistema de backups...</span>`;
                } else if (command.includes('commit') || command.includes('push')) {
                    output = `[main xyz123] Cambios subidos existosamente a la nube.`;
                } else {
                    output = `Uso de git: intenta 'git push --force' bajo tu propio riesgo.`;
                }
                break;

            case 'pwd':
                output = `/home/cua/workinnlab/ingeniatec/construyendo-el-futuro`;
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
                    output = `cd: falta directorio de destino. Secciones disponibles: nosotros, equipo, lineas, galeria, workinnlab, contacto`;
                }
                break;
            case 'credits':
                output = `<span class="text-gradient">SYSTEM_AUTHORS_SPEC:</span><br>
{<br>
&nbsp;&nbsp;"architect": <span class="text-gradient-primary">"Ing. Eduardo Pimienta"</span>,<br>
&nbsp;&nbsp;"role": "Root / Mentor Strategist",<br>
&nbsp;&nbsp;"engineers": ["Software Division - IngeniaTEC"],<br>
&nbsp;&nbsp;"mission": "Innovación Tecnológica Inmersiva",<br>
&nbsp;&nbsp;"status": <span style="color: #28c840;">"ONLINE / HACKEANDO EL FUTURO..."</span>,<br>
&nbsp;&nbsp;"fun_fact": "Nuestros robots sueñan en binario y desayunan filamento de impresora 3D."<br>
} <br>
<span style="color: var(--accent-pink)">(Si ves esto, estás invitado a hackear el futuro con nosotros en el WorkInnLab)</span>`;
                break;

            case 'reboot':
                isTyping = true;
                terminalInput.readOnly = true;
                const rebootMsg = `<span style="color: var(--accent-cyan)">Reiniciando INGENIA-OS...</span><br>
[📡] Cerrando conexiones con WorkInnLab...<br>
[💾] Guardando estado de los robots...<br>
[⚡] Reiniciando núcleos de innovación...<br>
<span style="color: var(--accent-pink)">Sistema reiniciado. ¡Bienvenido de nuevo!</span>`;

                setTimeout(() => {
                    const lines = Array.from(terminalHistory.children);
                    lines.forEach(line => {
                        if (line.id !== 'terminal-input-line') line.remove();
                    });

                    document.body.classList.remove('leet-mode'); // Asegurar que sale de modo leet al reiniciar

                    // Mostrar mensaje de reinicio
                    appendLine(rebootMsg, 'terminal-output', true);

                    // Después de la animación de reinicio, poner el estado inicial
                    setTimeout(() => {
                        appendLine(`<span class="terminal-prompt">user@host:~$</span> <span class="terminal-command">whoami</span>`);
                        appendLine(`<span class="terminal-text">INGENIATEC - Semillero de Investigación</span>`, 'terminal-output');

                        appendLine(`<span class="terminal-prompt">user@host:~$</span> <span class="terminal-command">cat areas.txt</span>`, 'mt-3');
                        appendLine(`<span class="terminal-text">[</span><span class="text-gradient">Impresión 3D</span><span class="terminal-text">,</span><span class="text-gradient">Electrónica</span><span class="terminal-text">,</span><span class="text-gradient">Robótica</span><span class="terminal-text">,</span><span class="text-gradient">Software</span><span class="terminal-text">]</span>`, 'terminal-output');

                        appendLine(`<span class="terminal-prompt">user@host:~$</span> <span class="terminal-command">./iniciar_proyecto.sh</span>`, 'mt-3');
                        appendLine(`<span class="terminal-text">🚀 Innovando desde WorkInnLab - CUA</span>`, 'terminal-output');

                        isTyping = false;
                        terminalInput.readOnly = false;
                        terminalInput.focus();
                    }, 4000); // Esperar a que termine el typewrite del rebootMsg
                }, 500);
                return;

            case 'npm':
                if (cmdParts[1] === 'install') {
                    if (cmdParts[2] === 'love') {
                        output = `<span style="color: var(--accent-pink)">Error: El amor ya viene pre-instalado en INGENIATEC. ❤️</span>`;
                    } else {
                        output = `npm notice: instalando ${cmdParts[2] || 'paquetes'}... <br>
added 1 package, and audited 2 packages in 3.12s<br>
1 package is looking for funding. run 'npm fund' for details.`;
                    }
                } else {
                    output = `npm usage: npm install [package]`;
                }
                break;

            case '1337':
                const isLeet = document.body.classList.toggle('leet-mode');
                if (isLeet) {
                    output = `<span style="color: #28c840;">L337 M0D3 4C71V473D... [0x1337]</span>`;
                } else {
                    output = `Retornando a la normalidad... Sistema estable.`;
                }
                break;

            case 'vim':
                output = `<span style="color: #ff5f57;">¿Atrapado en Vim?</span><br>
Escribe <span class="text-gradient-primary">:q</span> para salir... o mejor aún, únete al semillero y te enseñaremos cómo domesticar este editor.`;
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
