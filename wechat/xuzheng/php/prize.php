<?php


$arr = range(1, 10);
shuffle($arr);
foreach ($arr as $values) {
	echo $values;
}
?>