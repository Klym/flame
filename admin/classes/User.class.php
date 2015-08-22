<?php

class User extends DomainObject {
	private $login;
	private $password;
	private $email;
	private $access;
	private $name;
	private $fam;
	private $pol;
	private $regDate;
	private $birthDate;
	private $avatar;
	private $activation;
	
	function __construct($id = null, $login, $password, $email, $access, $name, $fam, $pol, $regDate, $birthDate, $avatar, $activation) {
		parent::__construct($id);
		$this->login = $login;
		$this->password = $password;
		$this->email = $email;
		$this->access = $access;
		$this->name = $name;
		$this->fam = $fam;
		$this->pol = $pol;
		$this->regDate = $regDate;
		$this->birthDate = $birthDate;
		$this->avatar = $avatar;
		$this->activation = $activation;
	}
	
	function getValues() {
		return array($this->login, $this->password, $this->email, $this->access, $this->name, $this->fam, $this->pol, $this->regDate, $this->birthDate, $this->avatar, $this->activation);
	}
}

?>