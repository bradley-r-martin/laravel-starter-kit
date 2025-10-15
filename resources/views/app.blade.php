<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Stacks of Snacks" />
    
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="vapid-public-key" content="{{ config('webpush.vapid.public_key') }}">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />


    <script type="text/javascript">
        // Prevent navigation and URL changes in iOS PWA standalone mode

        const noop = (...args) => {
    console.warn('[PWA] Navigation blocked to preserve standalone mode.', args);
    return null;
  };

  // --- 1. Patch history methods safely ---
  try {
    history.pushState = noop;
    history.replaceState = noop;
  } catch (err) {
    console.warn('[PWA] Could not override history methods:', err);
  }

  // --- 2. Patch window.location changes (assignment) ---
  const originalLocation = window.location;
  try {
    // Intercept `window.location = "something"`
    Object.defineProperty(window, 'location', {
      configurable: false,
      enumerable: true,
      get: () => originalLocation,
      set: (val) => {
        console.warn('[PWA] Direct location assignment blocked:', val);
      },
    });
  } catch (err) {
    console.warn('[PWA] Could not redefine window.location:', err);
  }

  // --- 3. Prevent popstate & hash navigation ---
  window.addEventListener('popstate', (e) => {
    console.warn('[PWA] popstate navigation blocked:', e);
    e.preventDefault();
    history.pushState(null, '', window.location.href);
  });

  window.addEventListener('hashchange', (e) => {
    console.warn('[PWA] hashchange blocked:', e);
    e.preventDefault();
    history.pushState(null, '', window.location.href.split('#')[0]);
  });

  // --- 4. Defensive overrides for assign/replace/reload if possible ---
  try {
    window.location.assign = noop;
    window.location.replace = noop;
    window.location.reload = noop;
  } catch {
    // On Safari, these are non-writable — just ignore
  }

  console.log('[PWA] Navigation locking active.');
    
     


  </script>
    @routes
    <!-- Scripts -->
 
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased  min-h-dvh overflow-hidden">
    @inertia
</body>
</html>
