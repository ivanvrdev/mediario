# Chat Asistente Médico

## Chat

```html
<!DOCTYPE html><html class="dark" lang="es" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Aura Medical Systems - Patient Portal</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&amp;family=Inter:wght@400;500&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface-container-high": "#222a3d",
                    "tertiary-fixed": "#ffddb8",
                    "primary-fixed-dim": "#adc6ff",
                    "on-secondary-fixed-variant": "#005236",
                    "tertiary-fixed-dim": "#ffb95f",
                    "on-tertiary-fixed-variant": "#653e00",
                    "on-secondary-container": "#00311f",
                    "primary-container": "#4d8eff",
                    "on-background": "#dae2fd",
                    "on-tertiary-container": "#3e2400",
                    "secondary": "#4edea3",
                    "on-secondary": "#003824",
                    "surface-bright": "#31394d",
                    "outline": "#8c909f",
                    "secondary-container": "#00a572",
                    "inverse-primary": "#005ac2",
                    "error-container": "#93000a",
                    "surface-tint": "#adc6ff",
                    "surface-container-highest": "#2d3449",
                    "primary": "#adc6ff",
                    "surface-container-lowest": "#060e20",
                    "error": "#ffb4ab",
                    "on-surface": "#dae2fd",
                    "surface-container": "#171f33",
                    "secondary-fixed": "#6ffbbe",
                    "on-tertiary": "#472a00",
                    "inverse-surface": "#dae2fd",
                    "surface-variant": "#2d3449",
                    "primary-fixed": "#d8e2ff",
                    "on-error": "#690005",
                    "on-tertiary-fixed": "#2a1700",
                    "secondary-fixed-dim": "#4edea3",
                    "tertiary": "#ffb95f",
                    "on-secondary-fixed": "#002113",
                    "background": "#0b1326",
                    "on-primary-container": "#00285d",
                    "on-primary": "#002e6a",
                    "inverse-on-surface": "#283044",
                    "tertiary-container": "#ca8100",
                    "surface-dim": "#0b1326",
                    "surface-container-low": "#131b2e",
                    "on-primary-fixed": "#001a42",
                    "on-error-container": "#ffdad6",
                    "surface": "#0b1326",
                    "on-primary-fixed-variant": "#004395",
                    "on-surface-variant": "#c2c6d6",
                    "outline-variant": "#424754"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "xl": "48px",
                    "sm": "16px",
                    "lg": "32px",
                    "base": "4px",
                    "container-max": "1440px",
                    "sidebar-width": "280px",
                    "md": "24px",
                    "xs": "8px"
            },
            "fontFamily": {
                    "headline-md": ["Hanken Grotesk"],
                    "label-sm": ["JetBrains Mono"],
                    "display-lg": ["Hanken Grotesk"],
                    "body-md": ["Inter"],
                    "body-lg": ["Inter"],
                    "title-lg": ["Hanken Grotesk"]
            },
            "fontSize": {
                    "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "display-lg": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "600"}]
            }
          },
        },
      }
    </script>
<style>
        body {
            background-color: #020617;
            color: #dae2fd;
            font-family: 'Inter', sans-serif;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .sidebar-active {
            border-left-width: 4px;
            border-left-color: #adc6ff;
            background-color: #2d3449;
            color: #adc6ff;
        }
        .glass-panel {
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(51, 65, 85, 0.3);
        }
        .technical-mono {
            font-family: 'JetBrains Mono', monospace;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 10px;
        }
        .scale-98-active:active {
            transform: scale(0.98);
        }
    </style>
</head>
<body class="overflow-hidden">
<!-- Navigation Drawer -->
<aside class="w-[280px] h-full fixed left-0 top-0 bg-surface-container border-r border-outline-variant/30 flex flex-col gap-xs p-md z-20">
<div class="mb-lg flex items-center gap-sm px-sm">
<div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-on-primary-container">clinical_notes</span>
</div>
<h1 class="text-title-lg font-title-lg text-on-surface">Chat Asistente Medico</h1>
</div>
<div class="px-sm mb-sm">
<h2 class="font-label-sm text-label-sm text-outline uppercase tracking-widest">Pacientes</h2>
</div>
<nav class="flex-1 flex flex-col gap-xs overflow-y-auto custom-scrollbar">
<!-- Nuevo paciente -->
<button class="flex items-center gap-sm bg-primary text-on-primary font-body-md text-body-md px-sm py-xs rounded-xl hover:opacity-90 transition-all scale-98-active mb-md">
<span class="material-symbols-outlined" data-icon="add">add</span>
                Nuevo paciente
            </button><div class="flex items-center gap-xs px-sm py-xs bg-surface-container-lowest rounded-lg border border-outline-variant/20 mb-sm mx-sm">
<span class="material-symbols-outlined text-outline text-[18px]" data-icon="search">search</span>
<input class="bg-transparent border-none focus:ring-0 text-body-md font-body-md text-on-surface placeholder-outline w-full" placeholder="Buscar paciente..." type="text">
</div>
<!-- Fulanito 1 -->
<a class="flex items-center gap-sm text-on-surface-variant hover:bg-surface-container-high px-sm py-xs transition-colors rounded-lg group" href="#">
<span class="material-symbols-outlined opacity-70 group-hover:opacity-100" data-icon="person">person</span>
<span class="font-body-md text-body-md">Fulanito 1</span>
</a>
<!-- Fulanito 2 (Active) -->
<a class="flex items-center gap-sm sidebar-active px-sm py-xs transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="font-body-md text-body-md">Fulanito 2</span>
</a>
<!-- Fulanito 3 -->
<a class="flex items-center gap-sm text-on-surface-variant hover:bg-surface-container-high px-sm py-xs transition-colors rounded-lg group" href="#">
<span class="material-symbols-outlined opacity-70 group-hover:opacity-100" data-icon="person">person</span>
<span class="font-body-md text-body-md">Fulanito 3</span>
</a>
<!-- Fulanito 4 -->
<a class="flex items-center gap-sm text-on-surface-variant hover:bg-surface-container-high px-sm py-xs transition-colors rounded-lg group" href="#">
<span class="material-symbols-outlined opacity-70 group-hover:opacity-100" data-icon="person">person</span>
<span class="font-body-md text-body-md">Fulanito 4</span>
</a>
</nav>
<div class="mt-auto border-t border-outline-variant/20 pt-md px-sm">
<div class="flex items-center gap-sm p-sm rounded-xl bg-surface-container-lowest">
<div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
<span class="material-symbols-outlined text-on-secondary-container text-[18px]">account_circle</span>
</div>
<div>
<p class="font-label-sm text-[12px] text-on-surface">Dr. Alexander</p>
<p class="font-label-sm text-[10px] text-outline">Oncology Dept.</p>
</div>
</div>
</div>
</aside>
<!-- Main Content Area -->
<main class="ml-[280px] h-screen flex flex-col relative bg-background">
<!-- Top App Bar -->
<header class="sticky top-0 w-full h-16 flex items-center justify-between px-lg bg-surface border-b border-outline-variant/30 z-10">
<div class="flex items-center gap-md">
<button class="p-xs hover:bg-surface-variant rounded-full transition-all text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="menu">info</span>
</button>
<h2 class="font-headline-md text-headline-md font-bold text-on-surface">12123124 - Fulanito 2</h2>
</div>
<div class="flex items-center gap-sm">

<button class="p-xs hover:text-primary cursor-pointer text-on-surface-variant transition-colors">
<span class="material-symbols-outlined" data-icon="settings">info</span>
</button>
</div>
</header>
<!-- Chat Arena -->
<section class="flex-1 overflow-y-auto custom-scrollbar py-lg px-xl">
<div class="max-w-[960px] mx-auto flex flex-col gap-lg pb-32">
<!-- Assistant Summary Bubble -->
<div class="flex gap-md w-full items-start">
<div class="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-primary text-[20px]">psychology</span>
</div>
<div class="max-w-[80%] glass-panel rounded-2xl rounded-tl-none p-md">
<p class="text-body-lg font-body-lg text-on-surface leading-relaxed">
                            En resumen, el paciente tiene esto, esto otro y así. Los marcadores inflamatorios muestran una tendencia estable con una leve mejoría en los valores basales comparados con el trimestre anterior.
                        </p>
</div>
</div>
<!-- User Message Bubble -->
<div class="flex gap-md w-full items-start justify-end">
<div class="max-w-[80%] bg-primary/10 border border-primary/40 rounded-2xl rounded-tr-none p-md">
<p class="text-body-lg font-body-lg text-on-surface">
                            Comparame x variable los últimos 5 estudios.
                        </p>
</div>
<div class="w-10 h-10 rounded-full bg-secondary-container/20 border border-secondary-container/30 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-secondary text-[20px]">medical_information</span>
</div>
</div>
<!-- Assistant Response (Data Table) -->
<div class="flex gap-md w-full items-start">
<div class="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-primary text-[20px]">psychology</span>
</div>
<div class="max-w-[85%] flex flex-col gap-sm">
<div class="glass-panel rounded-2xl rounded-tl-none p-md overflow-hidden">
<p class="text-body-md font-body-md text-on-surface mb-md">Aquí tienes la comparativa de la variable analizada en los últimos 5 registros:</p>
<!-- Studies List -->
<div class="flex flex-col gap-xs">
<!-- Study Row 1 -->
<div class="flex items-center justify-between p-sm bg-surface-container-high/40 rounded-xl border border-outline-variant/10">
<div class="flex items-center gap-sm">
<span class="font-label-sm text-label-sm text-outline">12 ENE</span>
<span class="font-body-md text-body-md text-on-surface">Hemoglobina Glicosilada</span>
</div>
<span class="technical-mono text-primary font-bold">6.2%</span>
</div>
<!-- Study Row 2 -->
<div class="flex items-center justify-between p-sm bg-surface-container-high/40 rounded-xl border border-outline-variant/10">
<div class="flex items-center gap-sm">
<span class="font-label-sm text-label-sm text-outline">28 FEB</span>
<span class="font-body-md text-body-md text-on-surface">Hemoglobina Glicosilada</span>
</div>
<span class="technical-mono text-primary font-bold">6.0%</span>
</div>
<!-- Study Row 3 -->
<div class="flex items-center justify-between p-sm bg-surface-container-high/40 rounded-xl border border-outline-variant/10">
<div class="flex items-center gap-sm">
<span class="font-label-sm text-label-sm text-outline">15 MAR</span>
<span class="font-body-md text-body-md text-on-surface">Hemoglobina Glicosilada</span>
</div>
<span class="technical-mono text-error font-bold">6.5%</span>
</div>
<!-- Study Row 4 -->
<div class="flex items-center justify-between p-sm bg-surface-container-high/40 rounded-xl border border-outline-variant/10">
<div class="flex items-center gap-sm">
<span class="font-label-sm text-label-sm text-outline">22 ABR</span>
<span class="font-body-md text-body-md text-on-surface">Hemoglobina Glicosilada</span>
</div>
<span class="technical-mono text-primary font-bold">6.1%</span>
</div>
<!-- Study Row 5 -->
<div class="flex items-center justify-between p-sm bg-surface-container-high/40 rounded-xl border border-outline-variant/10">
<div class="flex items-center gap-sm">
<span class="font-label-sm text-label-sm text-outline">05 JUN</span>
<span class="font-body-md text-body-md text-on-surface">Hemoglobina Glicosilada</span>
</div>
<span class="technical-mono text-primary font-bold">5.9%</span>
</div>
</div>
<!-- Range Summary Card -->
<div class="mt-md p-md bg-surface-container-lowest rounded-xl border border-primary/20 flex flex-col gap-xs">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[18px]">analytics</span>
<p class="font-label-sm text-label-sm text-primary uppercase">Rango de oscilación</p>
</div>
<div class="flex items-end gap-sm">
<p class="text-display-lg font-display-lg text-on-surface">0.6%</p>
<p class="text-body-md font-body-md text-outline mb-base">Diferencia max/min en el periodo analizado.</p>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Message Input Bar -->
<footer class="absolute bottom-0 left-0 w-full p-lg bg-gradient-to-t from-background via-background/95 to-transparent">
<div class="max-w-[960px] mx-auto">
<div class="glass-panel rounded-2xl flex items-center gap-sm p-sm focus-within:border-primary/50 transition-all shadow-xl">
<button class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-variant transition-colors text-outline-variant">
<span class="material-symbols-outlined" data-icon="add">add</span>
</button>
<input class="flex-1 bg-transparent border-none focus:ring-0 text-body-lg font-body-lg text-on-surface placeholder-outline/60" placeholder="Escribe un mensaje o solicita un análisis..." type="text">
<div class="flex items-center gap-xs">
<button class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-variant transition-colors text-outline-variant">
<span class="material-symbols-outlined" data-icon="mic">mic</span>
</button>
<button class="bg-primary text-on-primary p-sm rounded-xl scale-98-active transition-all flex items-center justify-center">
<span class="material-symbols-outlined">send</span>
</button>
</div>
</div>

</div>
</footer>
</main>
<!-- Floating Background Effect -->
<div class="fixed inset-0 pointer-events-none z-[-1] opacity-20">
<div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]"></div>
<div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[100px]"></div>
</div>
<script>
        // Micro-interaction for sidebar items
        document.querySelectorAll('aside a').forEach(link => {
            link.addEventListener('click', function(e) {
                document.querySelectorAll('aside a').forEach(l => l.classList.remove('sidebar-active'));
                this.classList.add('sidebar-active');
            });
        });

        // Chat Input focus handling
        const chatInput = document.querySelector('footer input');
        const inputContainer = document.querySelector('footer .glass-panel');
        
        chatInput.addEventListener('focus', () => {
            inputContainer.classList.add('ring-1', 'ring-primary/40');
        });
        
        chatInput.addEventListener('blur', () => {
            inputContainer.classList.remove('ring-1', 'ring-primary/40');
        });
    </script>






</body></html>
```

## Detalle de Archivos - Paciente

```html
<!DOCTYPE html><html class="dark" lang="es" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Aura Medical Systems - Patient Files</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700&amp;family=Inter:wght@400;500&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "inverse-primary": "#005ac2",
                    "on-secondary": "#003824",
                    "on-tertiary-fixed-variant": "#653e00",
                    "on-secondary-fixed-variant": "#005236",
                    "surface-dim": "#0b1326",
                    "secondary": "#4edea3",
                    "background": "#0b1326",
                    "on-secondary-container": "#00311f",
                    "on-primary-container": "#00285d",
                    "inverse-surface": "#dae2fd",
                    "surface": "#0b1326",
                    "on-error": "#690005",
                    "surface-variant": "#2d3449",
                    "on-primary-fixed": "#001a42",
                    "on-background": "#dae2fd",
                    "tertiary-fixed": "#ffddb8",
                    "surface-container-high": "#222a3d",
                    "secondary-fixed-dim": "#4edea3",
                    "on-primary": "#002e6a",
                    "surface-container-lowest": "#060e20",
                    "primary-fixed-dim": "#adc6ff",
                    "surface-bright": "#31394d",
                    "primary": "#adc6ff",
                    "tertiary-fixed-dim": "#ffb95f",
                    "surface-tint": "#adc6ff",
                    "primary-fixed": "#d8e2ff",
                    "on-tertiary-fixed": "#2a1700",
                    "on-tertiary-container": "#3e2400",
                    "surface-container-low": "#131b2e",
                    "primary-container": "#4d8eff",
                    "tertiary": "#ffb95f",
                    "on-surface-variant": "#c2c6d6",
                    "on-surface": "#dae2fd",
                    "on-error-container": "#ffdad6",
                    "secondary-fixed": "#6ffbbe",
                    "outline-variant": "#424754",
                    "tertiary-container": "#ca8100",
                    "on-primary-fixed-variant": "#004395",
                    "on-secondary-fixed": "#002113",
                    "surface-container": "#171f33",
                    "inverse-on-surface": "#283044",
                    "error": "#ffb4ab",
                    "on-tertiary": "#472a00",
                    "error-container": "#93000a",
                    "outline": "#8c909f",
                    "surface-container-highest": "#2d3449",
                    "secondary-container": "#00a572"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "xs": "8px",
                    "xl": "48px",
                    "sm": "16px",
                    "lg": "32px",
                    "sidebar-width": "280px",
                    "container-max": "1440px",
                    "base": "4px",
                    "md": "24px"
            },
            "fontFamily": {
                    "body-lg": ["Inter"],
                    "label-sm": ["JetBrains Mono"],
                    "display-lg": ["Hanken Grotesk"],
                    "title-lg": ["Hanken Grotesk"],
                    "headline-md": ["Hanken Grotesk"],
                    "body-md": ["Inter"]
            },
            "fontSize": {
                    "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                    "display-lg": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}]
            }
          },
        },
      }
    </script>
<style>
        body {
            background-color: #0b1326;
            color: #dae2fd;
            -webkit-font-smoothing: antialiased;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
            background: rgba(23, 31, 51, 0.4);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(140, 144, 159, 0.1);
        }
    </style>
</head>
<body class="min-h-screen flex flex-col font-body-md text-body-md">
<!-- TopAppBar Fragment as mandated by JSON (Partial implementation for this focused view) -->
<header class="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-md h-16 bg-surface border-b border-outline-variant/30">
<div class="flex items-center gap-sm">
<button aria-label="Back" class="p-xs hover:bg-surface-variant/50 transition-colors rounded-full flex items-center justify-center">
<span class="material-symbols-outlined text-primary">arrow_back</span>
</button>
<h1 class="font-headline-md text-headline-md font-bold text-primary">Chat Asistente Médico</h1>
</div>
<div class="flex items-center gap-xs">


</div>
</header>
<main class="mt-16 flex-1 flex justify-center p-lg">
<div class="w-full max-w-[960px] space-y-lg">
<!-- Navigation Action -->
<nav class="flex items-center">
<a class="group flex items-center gap-xs text-primary font-semibold hover:opacity-80 transition-all" href="#">
<span class="material-symbols-outlined">chat</span>
<span class="font-body-md text-body-md">Volver al chat</span>
</a>
</nav>
<!-- Patient Information Header -->
<section class="glass-panel rounded-xl p-lg space-y-lg">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
<div class="space-y-base">
<p class="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Nombre y Apellido</p>
<p class="font-title-lg text-title-lg text-on-surface">Aris Thorne</p>
</div>
<div class="space-y-base">
<p class="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">DNI</p>
<p class="font-title-lg text-title-lg text-on-surface">45.281.993</p>
</div>
<div class="space-y-base">
<p class="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Número de teléfono</p>
<p class="font-title-lg text-title-lg text-on-surface">+34 612 445 902</p>
</div>
<div class="space-y-base">
<p class="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Fecha de nacimiento</p>
<p class="font-title-lg text-title-lg text-on-surface">14 Mayo 1988</p>
</div>
<div class="space-y-base">
<p class="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Sexo</p>
<p class="font-title-lg text-title-lg text-on-surface">Masculino</p>
</div>
</div>
</section>
<!-- File List Section -->
<section class="space-y-sm">
<div class="flex items-center justify-between px-xs">
<h2 class="font-headline-md text-headline-md text-on-surface">Archivos subidos</h2>
<span class="font-label-sm text-label-sm text-on-surface-variant">4 archivos totales</span>
</div>
<div class="flex flex-col gap-xs">
<!-- File Item 1 -->
<div class="flex items-center justify-between p-sm rounded-lg border border-outline-variant/20 bg-surface-container-low hover:bg-surface-variant/30 transition-all cursor-pointer group">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 flex items-center justify-center rounded bg-primary/10 text-primary">
<span class="material-symbols-outlined">description</span>
</div>
<div>
<p class="text-on-surface font-body-lg text-body-lg">Analítica_Sangre_Oct.pdf</p>
<p class="text-on-surface-variant font-label-sm text-label-sm">PDF • 2.4 MB • Subido hace 2 días</p>
</div>
</div>
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">download</span>
</div>
<!-- File Item 2 -->
<div class="flex items-center justify-between p-sm rounded-lg border border-outline-variant/20 bg-surface-container-low hover:bg-surface-variant/30 transition-all cursor-pointer group">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 flex items-center justify-center rounded bg-secondary/10 text-secondary">
<span class="material-symbols-outlined">image</span>
</div>
<div>
<p class="text-on-surface font-body-lg text-body-lg">Radiografía_Torax.jpg</p>
<p class="text-on-surface-variant font-label-sm text-label-sm">JPG • 4.8 MB • Subido hace 1 semana</p>
</div>
</div>
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">download</span>
</div>
<!-- File Item 3 -->
<div class="flex items-center justify-between p-sm rounded-lg border border-outline-variant/20 bg-surface-container-low hover:bg-surface-variant/30 transition-all cursor-pointer group">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 flex items-center justify-center rounded bg-primary/10 text-primary">
<span class="material-symbols-outlined">description</span>
</div>
<div>
<p class="text-on-surface font-body-lg text-body-lg">Historial_Clinico_Resumen.pdf</p>
<p class="text-on-surface-variant font-label-sm text-label-sm">PDF • 1.1 MB • Subido hace 2 semanas</p>
</div>
</div>
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">download</span>
</div>
<!-- File Item 4 -->
<div class="flex items-center justify-between p-sm rounded-lg border border-outline-variant/20 bg-surface-container-low hover:bg-surface-variant/30 transition-all cursor-pointer group">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 flex items-center justify-center rounded bg-tertiary/10 text-tertiary">
<span class="material-symbols-outlined">biotech</span>
</div>
<div>
<p class="text-on-surface font-body-lg text-body-lg">Resultados_PCR_Nov.pdf</p>
<p class="text-on-surface-variant font-label-sm text-label-sm">PDF • 890 KB • Subido ayer</p>
</div>
</div>
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">download</span>
</div>
</div>
</section>
</div>
</main>
<!-- Visual Anchor - Atmospheric Layer -->
<div class="fixed inset-0 -z-10 pointer-events-none opacity-20">
<div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
<div class="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]"></div>
</div>
<script>
        // Micro-interactions for list items
        document.querySelectorAll('.flex-col > div').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(4px)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
            });
        });
    </script>


</body></html>
```

## Registro de Paciente
```html
<!DOCTYPE html>

<html class="dark" lang="es" style=""><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&amp;family=Inter:wght@400;500&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        body {
            background-color: #0b1326;
            color: #dae2fd;
            font-family: 'Inter', sans-serif;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .form-container {
            width: 100%;
            max-width: 520px;
        }
        /* Custom ring for focus states following brand colors */
        .focus-ring:focus {
            outline: none;
            box-shadow: 0 0 0 2px #adc6ff;
        }
        /* Hide default calendar icon in some browsers to maintain style */
        input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(0.8) sepia(50%) saturate(1000%) hue-rotate(190deg);
            cursor: pointer;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "primary-fixed": "#d8e2ff",
                        "primary": "#adc6ff",
                        "outline": "#8c909f",
                        "on-secondary": "#003824",
                        "primary-container": "#4d8eff",
                        "inverse-primary": "#005ac2",
                        "on-primary-container": "#00285d",
                        "tertiary-fixed-dim": "#ffb95f",
                        "on-surface": "#dae2fd",
                        "surface-variant": "#2d3449",
                        "surface-container-low": "#131b2e",
                        "secondary": "#4edea3",
                        "on-tertiary-container": "#3e2400",
                        "surface-container-high": "#222a3d",
                        "on-error-container": "#ffdad6",
                        "on-secondary-fixed-variant": "#005236",
                        "error": "#ffb4ab",
                        "secondary-fixed-dim": "#4edea3",
                        "error-container": "#93000a",
                        "surface-dim": "#0b1326",
                        "on-surface-variant": "#c2c6d6",
                        "surface-bright": "#31394d",
                        "secondary-fixed": "#6ffbbe",
                        "primary-fixed-dim": "#adc6ff",
                        "background": "#0b1326",
                        "surface-container-highest": "#2d3449",
                        "surface-container": "#171f33",
                        "on-secondary-container": "#00311f",
                        "on-primary-fixed-variant": "#004395",
                        "inverse-surface": "#dae2fd",
                        "on-tertiary-fixed": "#2a1700",
                        "on-tertiary": "#472a00",
                        "outline-variant": "#424754",
                        "inverse-on-surface": "#283044",
                        "tertiary": "#ffb95f",
                        "on-tertiary-fixed-variant": "#653e00",
                        "on-primary-fixed": "#001a42",
                        "tertiary-fixed": "#ffddb8",
                        "tertiary-container": "#ca8100",
                        "surface-container-lowest": "#060e20",
                        "on-secondary-fixed": "#002113",
                        "on-error": "#690005",
                        "surface": "#0b1326",
                        "on-background": "#dae2fd",
                        "secondary-container": "#00a572",
                        "surface-tint": "#adc6ff",
                        "on-primary": "#002e6a"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "md": "24px",
                        "container-max": "1440px",
                        "sidebar-width": "280px",
                        "base": "4px",
                        "lg": "32px",
                        "xs": "8px",
                        "sm": "16px",
                        "xl": "48px"
                    },
                    "fontFamily": {
                        "display-lg": ["Hanken Grotesk"],
                        "body-md": ["Inter"],
                        "label-sm": ["JetBrains Mono"],
                        "title-lg": ["Hanken Grotesk"],
                        "headline-md": ["Hanken Grotesk"],
                        "body-lg": ["Inter"]
                    },
                    "fontSize": {
                        "display-lg": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
                        "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500" }],
                        "title-lg": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
                        "headline-md": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }]
                    }
                },
            },
        }
    </script>
</head>
<body class="bg-background text-on-background">
<!-- Form Main Container -->
<main class="form-container px-sm md:px-lg flex flex-col items-center justify-center min-h-screen">
<div class="bg-surface-container border border-outline-variant/30 rounded-xl p-md md:p-lg shadow-2xl">
<!-- Header Section -->
<header class="mb-lg">
<h1 class="font-headline-md text-headline-md text-primary mb-xs">Registro de Paciente</h1>
<p class="font-body-md text-body-md text-on-surface-variant">Complete los datos obligatorios para crear la ficha clínica.</p>
</header>
<!-- Form Content -->
<form class="space-y-sm" id="registrationForm">
<!-- Full Name Field -->
<div class="flex flex-col gap-xs">
<label class="font-title-lg text-title-lg text-on-surface text-sm" for="fullName">Nombre y Apellido</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">person</span>
<input class="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg pl-11 pr-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="fullName" name="fullName" placeholder="Ej. Juan Pérez" required="" type="text"/>
</div>
</div>
<!-- ID Field -->
<div class="flex flex-col gap-xs">
<label class="font-title-lg text-title-lg text-on-surface text-sm" for="dni">DNI</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">badge</span>
<input class="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg pl-11 pr-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="dni" name="dni" placeholder="00.000.000" required="" type="text"/>
</div>
</div>
<!-- Date of Birth Field -->
<div class="flex flex-col gap-xs">
<label class="font-title-lg text-title-lg text-on-surface text-sm" for="dob">Fecha de nacimiento</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">calendar_today</span>
<input class="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg pl-11 pr-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="dob" name="dob" required="" type="date"/>
</div>
</div><div class="flex flex-col gap-xs">
<label class="font-title-lg text-title-lg text-on-surface text-sm" for="gender">Sexo</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">wc</span>
<input class="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg pl-11 pr-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="gender" name="gender" placeholder="Ej. Masculino, Femenino, Otro" type="text"/>
</div>
</div><div class="flex flex-col gap-xs">
<label class="font-title-lg text-title-lg text-on-surface text-sm" for="phone">Número de teléfono</label>
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">phone</span>
<input class="w-full bg-surface-container-high border border-outline-variant/50 rounded-lg pl-11 pr-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="phone" name="phone" placeholder="Ej. +34 000 000 000" type="tel"/>
</div>
</div>
<!-- Action Buttons -->
<div class="flex flex-col md:flex-row gap-sm pt-md">
<button class="flex-1 order-2 md:order-1 px-lg py-3 rounded-lg border border-outline-variant text-on-surface font-title-lg text-sm font-semibold hover:bg-surface-container-highest transition-colors active:scale-[0.98]" onclick="handleCancel()" type="button">
                        Cancelar
                    </button>
<button class="flex-1 order-1 md:order-2 px-lg py-3 rounded-lg bg-primary text-on-primary font-title-lg text-sm font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" type="submit">
                        Guardar
                    </button>
</div>
</form>
</div>
<!-- Footer context (Optional/Subtle) -->
<footer class="mt-md text-center">
</footer>
</main>
<script>
        // Micro-interaction for form submission
        document.getElementById('registrationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[20px]">sync</span>';
            
            // Simulating API call
            setTimeout(() => {
                submitBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">check_circle</span>';
                submitBtn.classList.remove('bg-primary');
                submitBtn.classList.add('bg-secondary', 'text-on-secondary');
                
                setTimeout(() => {
                    alert('Paciente registrado exitosamente.');
                    location.reload();
                }, 1000);
            }, 1500);
        });

        function handleCancel() {
            if(confirm('¿Está seguro que desea cancelar? Se perderán los datos ingresados.')) {
                document.getElementById('registrationForm').reset();
            }
        }
    </script>
</body></html>
```
## Login
```html
<!DOCTYPE html><html class="dark" lang="es" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Clinical Intelligence | Login</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&amp;family=Inter:wght@400;500&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "error-container": "#93000a",
                    "tertiary-fixed": "#ffddb8",
                    "secondary-fixed-dim": "#4edea3",
                    "primary-container": "#4d8eff",
                    "on-secondary-fixed-variant": "#005236",
                    "surface-container-highest": "#2d3449",
                    "on-primary": "#002e6a",
                    "surface": "#0b1326",
                    "on-surface-variant": "#c2c6d6",
                    "primary-fixed": "#d8e2ff",
                    "on-error-container": "#ffdad6",
                    "on-tertiary": "#472a00",
                    "on-primary-fixed-variant": "#004395",
                    "inverse-primary": "#005ac2",
                    "on-primary-fixed": "#001a42",
                    "tertiary": "#ffb95f",
                    "tertiary-container": "#ca8100",
                    "outline-variant": "#424754",
                    "surface-tint": "#adc6ff",
                    "inverse-surface": "#dae2fd",
                    "background": "#0b1326",
                    "outline": "#8c909f",
                    "surface-dim": "#0b1326",
                    "on-secondary-fixed": "#002113",
                    "primary-fixed-dim": "#adc6ff",
                    "on-surface": "#dae2fd",
                    "primary": "#adc6ff",
                    "secondary-container": "#00a572",
                    "inverse-on-surface": "#283044",
                    "on-error": "#690005",
                    "tertiary-fixed-dim": "#ffb95f",
                    "secondary": "#4edea3",
                    "on-secondary-container": "#00311f",
                    "error": "#ffb4ab",
                    "surface-container-low": "#131b2e",
                    "surface-container-lowest": "#060e20",
                    "secondary-fixed": "#6ffbbe",
                    "on-primary-container": "#00285d",
                    "on-background": "#dae2fd",
                    "surface-container": "#171f33",
                    "on-secondary": "#003824",
                    "surface-variant": "#2d3449",
                    "on-tertiary-fixed-variant": "#653e00",
                    "surface-bright": "#31394d",
                    "on-tertiary-fixed": "#2a1700",
                    "on-tertiary-container": "#3e2400",
                    "surface-container-high": "#222a3d"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "xl": "48px",
                    "md": "24px",
                    "xs": "8px",
                    "base": "4px",
                    "sidebar-width": "280px",
                    "lg": "32px",
                    "sm": "16px",
                    "container-max": "1440px"
            },
            "fontFamily": {
                    "label-sm": ["JetBrains Mono"],
                    "title-lg": ["Hanken Grotesk"],
                    "display-lg": ["Hanken Grotesk"],
                    "headline-md": ["Hanken Grotesk"],
                    "body-lg": ["Inter"],
                    "body-md": ["Inter"]
            },
            "fontSize": {
                    "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                    "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                    "display-lg": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}]
            }
          },
        },
      }
    </script>
<style>
        body {
            background-color: #0b1326; /* Using background color from config directly */
            color: #dae2fd; /* on-background */
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
        }

        .login-card {
            background-color: #131b2e; /* surface-container-low */
            border: 1px solid rgba(140, 144, 159, 0.15); /* outline at low opacity */
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
        }

        input::placeholder {
            color: #8c909f; /* outline */
            opacity: 0.6;
        }

        .transition-all-custom {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Subtle interaction for the primary button */
        .btn-primary:active {
            transform: scale(0.98);
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-md selection:bg-primary/30 flex items-center justify-center min-h-screen">
<!-- Login Container -->
<main class="w-full max-w-[420px] px-md">
<!-- Login Card -->
<div class="login-card p-xl rounded-xl flex flex-col space-y-md">
<!-- Header Section -->
<header class="space-y-base text-center">
<h1 class="font-headline-md text-headline-md text-on-surface">Iniciar Sesión</h1>
</header>
<!-- Form Section -->
<form action="#" class="flex flex-col space-y-sm" method="POST" onsubmit="return false;">
<!-- Email Input -->
<div class="flex flex-col space-y-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider" for="email">Email</label>
<input class="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-sm py-sm text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-custom" id="email" name="email" placeholder="doctor@clinic.com" required="" type="email">
</div>
<!-- Password Input -->
<div class="flex flex-col space-y-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider" for="password">Password</label>
<input class="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-sm py-sm text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-custom" id="password" name="password" placeholder="••••••••" required="" type="password">
</div>
<!-- Login Button -->
<div class="pt-base">
<button class="btn-primary w-full bg-primary text-on-primary font-title-lg text-title-lg py-sm rounded-lg hover:bg-primary-fixed-dim transition-all-custom cursor-pointer" type="submit">
                        Enviar</button>
</div>
</form>
<!-- Footer Link -->
<footer class="text-center pt-xs">
<a class="text-body-md font-body-md text-primary hover:text-primary-fixed-dim transition-colors duration-200" href="#">
                    ¿No tienes cuenta? Regístrate
                </a>
</footer>
</div>
<!-- System Version / Semantic Anchor (Subtle) -->
<div class="mt-md text-center">

</div>
</main>
<!-- Micro-interaction Script -->
<script>
        // Simple focus/blur state feedback or future validation logic
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.querySelector('label').classList.replace('text-on-surface-variant', 'text-primary');
            });
            input.addEventListener('blur', () => {
                input.parentElement.querySelector('label').classList.replace('text-primary', 'text-on-surface-variant');
            });
        });
    </script>


</body></html>
```
## Registro de Usuario
```html
<!DOCTYPE html><html class="dark" lang="es" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Registro de Usuario - Clinical Intelligence</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&amp;family=Inter:wght@400;500&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary-container": "#3e2400",
                    "on-error": "#690005",
                    "secondary-fixed": "#6ffbbe",
                    "secondary-container": "#00a572",
                    "primary-fixed-dim": "#adc6ff",
                    "on-tertiary": "#472a00",
                    "on-error-container": "#ffdad6",
                    "surface-container": "#171f33",
                    "surface-container-highest": "#2d3449",
                    "on-primary-fixed-variant": "#004395",
                    "secondary-fixed-dim": "#4edea3",
                    "on-background": "#dae2fd",
                    "inverse-on-surface": "#283044",
                    "surface-dim": "#0b1326",
                    "surface-container-low": "#131b2e",
                    "on-secondary-fixed": "#002113",
                    "primary-fixed": "#d8e2ff",
                    "primary-container": "#4d8eff",
                    "on-secondary-fixed-variant": "#005236",
                    "primary": "#adc6ff",
                    "on-primary-fixed": "#001a42",
                    "on-tertiary-fixed": "#2a1700",
                    "secondary": "#4edea3",
                    "tertiary-fixed": "#ffddb8",
                    "background": "#0b1326",
                    "on-tertiary-fixed-variant": "#653e00",
                    "on-primary": "#002e6a",
                    "on-surface-variant": "#c2c6d6",
                    "on-primary-container": "#00285d",
                    "surface-container-lowest": "#060e20",
                    "surface-variant": "#2d3449",
                    "outline": "#8c909f",
                    "surface": "#0b1326",
                    "outline-variant": "#424754",
                    "inverse-primary": "#005ac2",
                    "error": "#ffb4ab",
                    "surface-container-high": "#222a3d",
                    "inverse-surface": "#dae2fd",
                    "on-secondary-container": "#00311f",
                    "tertiary": "#ffb95f",
                    "on-secondary": "#003824",
                    "tertiary-fixed-dim": "#ffb95f",
                    "error-container": "#93000a",
                    "surface-tint": "#adc6ff",
                    "tertiary-container": "#ca8100",
                    "surface-bright": "#31394d",
                    "on-surface": "#dae2fd"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "lg": "32px",
                    "base": "4px",
                    "xl": "48px",
                    "sm": "16px",
                    "sidebar-width": "280px",
                    "md": "24px",
                    "container-max": "1440px",
                    "xs": "8px"
            },
            "fontFamily": {
                    "label-sm": ["JetBrains Mono"],
                    "headline-md": ["Hanken Grotesk"],
                    "title-lg": ["Hanken Grotesk"],
                    "body-md": ["Inter"]
            },
            "fontSize": {
                    "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                    "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}]
            }
          },
        },
      }
    </script>
<style>
        body {
            background-color: #0b1326;
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        .glass-card {
            background-color: #0F172A;
            border: 1px solid rgba(51, 65, 85, 0.4);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .input-focus-ring:focus {
            outline: none;
            border-color: #3B82F6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen p-md">
<!-- Main Registration Container -->
<main class="w-full max-w-md">
<div class="glass-card rounded-xl p-lg flex flex-col gap-lg">
<!-- Header Section -->
<div class="flex flex-col gap-xs text-center">
<h1 class="font-headline-md text-headline-md text-on-background tracking-tight">
                    Registro de Usuario
                </h1>
<p class="font-body-md text-body-md text-on-surface-variant">
                    Clinical Intelligence Access Management
                </p>
</div>
<!-- Registration Form -->
<form action="#" class="flex flex-col gap-md" method="POST">
<!-- Nombre y Apellido -->
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest" for="full_name">
                        Nombre y Apellido
                    </label>
<input class="bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-on-surface font-body-md input-focus-ring transition-all placeholder:text-outline" id="full_name" name="full_name" placeholder="Juan Pérez" required="" type="text">
</div>
<!-- Correo Electrónico -->
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest" for="email">
                        Correo Electrónico
                    </label>
<input class="bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-on-surface font-body-md input-focus-ring transition-all placeholder:text-outline" id="email" name="email" placeholder="usuario@clinical.ai" required="" type="email">
</div>
<!-- Número de teléfono -->
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest" for="phone">
                        Número de teléfono
                    </label>
<input class="bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-on-surface font-body-md input-focus-ring transition-all placeholder:text-outline" id="phone" name="phone" placeholder="+34 000 000 000" required="" type="tel">
</div>
<!-- Contraseña -->
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest" for="password">
                        Contraseña
                    </label>
<input class="bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-on-surface font-body-md input-focus-ring transition-all" id="password" name="password" placeholder="••••••••" required="" type="password">
</div>
<!-- Verificar contraseña -->
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest" for="verify_password">
                        Verificar contraseña
                    </label>
<input class="bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-on-surface font-body-md input-focus-ring transition-all" id="verify_password" name="verify_password" placeholder="••••••••" required="" type="password">
</div>
<!-- Action Button -->
<button class="mt-base bg-primary hover:bg-primary-container text-on-primary font-title-lg text-title-lg py-sm rounded-lg transition-all transform active:scale-[0.98] focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background" type="submit">
                    Guardar
                </button>
</form>
<!-- Metadata / Footer Info -->
<div class="pt-md border-t border-outline-variant/30 text-center">

</div>
</div>
</main>
<!-- Micro-interaction Script -->
<script>
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Procesando...';
            btn.disabled = true;
            btn.classList.add('opacity-70', 'cursor-not-allowed');
            
            // Simulating a clinical precision delay
            setTimeout(() => {
                alert('Registro completado exitosamente.');
                btn.innerText = originalText;
                btn.disabled = false;
                btn.classList.remove('opacity-70', 'cursor-not-allowed');
            }, 1200);
        });
    </script>


</body></html>
```