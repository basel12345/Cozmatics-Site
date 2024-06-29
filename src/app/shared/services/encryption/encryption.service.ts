import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
	providedIn: 'root'
})
export class EncryptionService {
	public key ='backoffice';
	public iv = CryptoJS.enc.Utf8.parse('6896631234900212');

	constructor() { }


	encryptData(value: string): string {
		var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), this.key,
			{
				keySize: 128 / 8,
				iv: this.iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			}).toString();
		return encrypted;
	}

	public Decrypt(valueEcrypted: string) {
		var decrypted = CryptoJS.AES.decrypt(valueEcrypted, this.key, {
			keySize: 128 / 8,
			iv: this.iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return decrypted;
	}

}
