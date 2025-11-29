<?php include("../include/all.php"); 


 // FONKSIYON
function fonksiyon1()
{
	$liste = [];

	$q = mysql_query("SELECT * FROM urun LIMIT 0,1000");
		while ($d=mysql_fetch_array($q))
		{
			
			$marka = $d['markaID'];
			$cat = $d['catID'];
			$stok = $d['stok'];

			$liste[] = [
				'id' => $d['ID'],
				'name' => $d['name'],
				'tedarikciID' => $d['tedarikciID'],
				'tedarikciCode' => $d['tedarikciCode'],
				'markaID' => hq("SELECT name FROM marka WHERE ID = '$marka'"),
				'catID' => hq("SELECT namePath FROM kategori WHERE ID = '$cat'"),
				'fiyat' => $d['fiyat'],
				'kur' => $d['fiyatBirim'],
				'stok' => $d['stok'],
		
			];

		}
	return json_encode($liste);
}




echo fonksiyon1();
?>