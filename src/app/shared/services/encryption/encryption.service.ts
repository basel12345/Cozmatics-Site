import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
	providedIn: 'root'
})
export class EncryptionService {
	constructor() { }


	public encryptData(data: string): string {
		let key = CryptoJS.enc.Utf8.parse('13313586896631234900207000800912');
		let iv = CryptoJS.enc.Utf8.parse('6896631234900212');
		var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key,
			{
				keySize: 128 / 8,
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			}).toString();
		return encrypted;
	}


}
