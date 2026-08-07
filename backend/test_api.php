<?php
$ch = curl_init('http://localhost:8000/api/auth/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json', 'Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['email' => 'sanya@gmail.com', 'password' => 'sanya123']));
$response = curl_exec($ch);
preg_match('/^Set-Cookie:\s*(taberu_token=[^;]*)/mi', $response, $m);
$cookie = $m[1] ?? '';
curl_close($ch);

$ch2 = curl_init('http://localhost:8000/api/auth/me');
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_HTTPHEADER, ['Accept: application/json', 'Cookie: ' . $cookie]);
echo "Auth Me Output:\n" . curl_exec($ch2) . "\n";
curl_close($ch2);
