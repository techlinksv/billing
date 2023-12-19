<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>KMCA</title>

  <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('icons/apple-touch-icon.png') }}">
  <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('icons/favicon-32x32.png') }}">
  <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('icons/favicon-16x16.png') }}">
  <link rel="manifest" href="{{ asset('icons/site.webmanifest') }}">
  <link rel="mask-icon" href="{{ asset('icons/safari-pinned-tab.svg" color="#f51806') }}">
  <meta name="msapplication-TileColor" content="#2b5797">
  <meta name="theme-color" content="#f51806">
</head>
<body>
  <div id="root"></div>

  @viteReactRefresh
  @vite(['resources/ts/index.tsx'])

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
    rel="stylesheet"
  />
</body>
</html>
