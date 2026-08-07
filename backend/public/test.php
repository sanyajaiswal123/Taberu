<?php try { $m = new \MongoDB\Driver\Manager("mongodb://127.0.0.1/"); echo "Success: " . get_class($m); } catch (Throwable $e) { echo "Error: " . $e->getMessage(); }
