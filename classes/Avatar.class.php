<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

class Avatar {
	const JPEG = "image/jpeg";
	const GIF = "image/gif";
	const PNG = "image/png";
	
	private $filePath;
	private $width;
	private $height;
	private $imageInfo;
	private $format;
	private $resource;
	
	protected function __construct($filePath) {
		if (!self::isFileExists($filePath))
			throw new FileNotFoundException();
		$this->filePath = $filePath;
		$imageInfo = $this->getImageInfo();
		if (!is_array($imageInfo))
			throw new InvalidFileException($filePath);
		$this->format = $imageInfo["mime"];
		$this->width = $imageInfo[0];
		$this->height = $imageInfo[1];
	}
	
	public static function createImage($filePath) {
		$avatar = new Avatar($filePath);
		switch ($avatar->format) {
			case self::JPEG :
				$img = new AvatarJPG($filePath);
			break;
			case self::GIF :
				$img = new AvatarGIF($filePath);
			break;
			case self::PNG :
				$img = new AvatarPNG($filePath);
			break;
			default:
				throw new InvalidFileException($filePath);
			break;
		}
		unlink($filePath);
		return $img;
	}
	
	public function crop($x0='', $y0='', $size, $width) {
		if (empty($size) || empty($width)) throw new InvalidParamsException();
		if (empty($x0) && empty($y0)) {$x0 = 0; $y0 = 0;}
		$height = $width*$this->height/$this->width;
		$x = $x0*$this->width/$width;
		$y = $y0*$this->height/$height;
		$newSize = $size*$this->height/$height;
		$newimageresource = imagecreatetruecolor(150,150);
		imageAlphaBlending($newimageresource, false);
		imageSaveAlpha($newimageresource, true);
		imagecopyresampled($newimageresource,$this->getResource(),0,0,$x,$y,150,150,$newSize,$newSize);
		switch ($this->format) {
			case self::JPEG :
				$aname = "a".time().".jpg";
				if (!imagejpeg($newimageresource,"avatars/".$aname,100))
					throw new FileNotSaveException();
			break;
			case self::GIF :
				$aname = "a".time().".gif";
				if (!imagegif($newimageresource,"avatars/".$aname))
					throw new FileNotSaveException();
			break;
			case self::PNG :
				$aname = "a".time().".png";
				if (!imagepng($newimageresource,"avatars/".$aname,9))
					throw new FileNotSaveException();
			break;
		}
		return $aname;
	}
	
	public function getImageInfo() {
		$this->imageInfo = @getimagesize($this->getFilePath());
		return $this->imageInfo;
	}
	
	public static function isFileExists($filePath) {
		if (@file_exists($filePath))
			return true;

		if(!preg_match("|^http(s)?|", $filePath))
			return false;

		$headers = @get_headers($filePath);
		if(preg_match("|200|", $headers[0]))
			return true;

		return false;
	}
	
	public function getFilePath() {
		return $this->filePath;
	}
	
	protected function setResource($resource) {
		return $this->resource = $resource;
	}
	
	public function getResource() {
		return $this->resource;
	}
}

class AvatarJPG extends Avatar {
	protected function __construct($filePath) {
		parent::__construct($filePath);
		$path = parent::getFilePath();
		parent::setResource(@imagecreatefromjpeg($path));
	}
}

class AvatarGIF extends Avatar {
	protected function __construct($filePath) {
		parent::__construct($filePath);
		$path = parent::getFilePath();
		parent::setResource(@imagecreatefromgif($path));
	}
}

class AvatarPNG extends Avatar {
	protected function __construct($filePath) {
		parent::__construct($filePath);
		$path = parent::getFilePath();
		parent::setResource(@imagecreatefrompng($path));
	}
}

abstract class FileException extends Exception {
	function __construct() {
		$this->message = static::MESSAGE;
		die("<html><head>
		<meta http-equiv='refresh' content='3; url=page.php'>".$this->message.
		"</head></html>");
	}
}

class InvalidFileException extends Exception {
	public function __construct($path) {
		$this->message = "Неверный файл: ".$path;
		unlink($path);
		die($this->message);
	}
}

class FileNotFoundException extends FileException {
	const MESSAGE = "Файл не найден.";
}

class InvalidParamsException extends FileException {
	const MESSAGE = "Переданы не все параметры обрезки аватара.";
}

class FileNotSaveException extends FileException {
	const MESSAGE = "Файл не сохранен.";
}
?>