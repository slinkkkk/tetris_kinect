<?php
	
	$nome_arquivo_load = $_GET['load'];
	$nome_arquivo_save = $_GET['save'];
	
	$arquivoOrigem = file_get_contents($nome_arquivo_load);
	
	$folder = "textures/";
	
	file_put_contents($folder.$nome_arquivo_save, $arquivoOrigem);
	
?>