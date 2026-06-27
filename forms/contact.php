<?php
/**
 * Contact form handler — validates input and appends submissions to a JSON file.
 */

header('Content-Type: text/plain; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit('Method not allowed');
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $subject === '' || $message === '') {
  http_response_code(400);
  exit('Please fill in all required fields.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  exit('Please enter a valid email address.');
}

$name = mb_substr($name, 0, 200);
$email = mb_substr($email, 0, 200);
$subject = mb_substr($subject, 0, 300);
$message = mb_substr($message, 0, 5000);

$submission = [
  'id' => uniqid('', true),
  'name' => $name,
  'email' => $email,
  'subject' => $subject,
  'message' => $message,
  'submitted_at' => gmdate('c'),
  'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
];

$dataDir = __DIR__ . '/data';
$file = $dataDir . '/submissions.json';

if (!is_dir($dataDir) && !mkdir($dataDir, 0755, true)) {
  http_response_code(500);
  exit('Unable to create data directory.');
}

$submissions = [];
if (is_file($file)) {
  $content = file_get_contents($file);
  $decoded = json_decode($content, true);
  if (is_array($decoded)) {
    $submissions = $decoded;
  }
}

$submissions[] = $submission;

$json = json_encode($submissions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
if ($json === false) {
  http_response_code(500);
  exit('Unable to encode submission data.');
}

if (file_put_contents($file, $json, LOCK_EX) === false) {
  http_response_code(500);
  exit('Unable to save submission. Check that the server can write to forms/data/.');
}

echo 'OK';
