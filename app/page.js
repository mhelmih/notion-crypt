"use client";

import Link from "next/link";
import { useState } from "react";
import forge from "node-forge";

export default function Home() {
  const [password, setPassword] = useState("");
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [key, setKey] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [isEncrypt, setIsEncrypt] = useState(true);
  const [n, setN] = useState("");

  const rsa = forge.pki.rsa;

  // enter password as the key
  const generateKeys = () => {
    // rsa.generateKey(2048).then((keypair) => {
    //   setPublicKey(keypair.publicKey);
    //   setPrivateKey(keypair.privateKey);
    //   setN(keypair.publicKey.n.toString(16));
    //   setKey(keypair.publicKey.e.toString(16));
    //   setIsGenerated(true);
    // });
    rsa.generateKeyPair({ bits: 2048, workers: -1 }, function (err, keypair) {
      setPublicKey(keypair.publicKey);
      setPrivateKey(keypair.privateKey);
      setN(keypair.publicKey.n.toString(16));
      setKey(keypair.publicKey.e.toString(16));
      setIsGenerated(true);
    });
  };

  const process = () => {
    if (isEncrypt) {
      // convert key from hex to decimal
      // const e = BigInt("0x" + key);
      // const n = BigInt("0x" + n);
      // publicKey.e = e;
      // publicKey.n = n;

      encrypt();
    } else {
      // convert key from hex to decimal
      // const d = BigInt("0x" + key);
      // const n = BigInt("0x" + n);
      // privateKey.d = d;
      // privateKey.n = n;

      decrypt();
    }
  };

  const encrypt = () => {
    // convert text from string to bytes
    const bytes = forge.util.encodeUtf8(text);
    // encrypt bytes
    const encrypted = publicKey.encrypt(bytes);
    // convert encrypted bytes to hex
    const hex = forge.util.bytesToHex(encrypted);
    setResult(hex);
  };

  const decrypt = () => {
    const bytes = forge.util.hexToBytes(text);
    const decrypted = privateKey.decrypt(bytes);
    const utf8 = forge.util.decodeUtf8(decrypted);
    setResult(utf8);
  };

  return (
    <main className="w-[50%]">
      <h1 className="text-3xl font-semibold">Notion RSA</h1>

      <button type="button" className="p-4 border-2" onClick={generateKeys}>
        Generate Keys
      </button>
      <div className={isGenerated ? "pt-6 break-words" : "hidden"}>
        <h2 className="text-xl font-medium">Public Key</h2>
        <p>Use this for encryption:</p>
        <p>Key: {isGenerated ? publicKey.e.toString(16) : ""}</p>
        <p>N: {n}</p>
        <h2 className="text-xl font-medium">Private Key</h2>
        <p>Use this for decryption [KEEP IT SECRET!]:</p>
        <p>Key: {isGenerated ? privateKey.d.toString(16) : ""}</p>
        <p>N: {n}</p>
      </div>
      <div className="pt-6">
        <h2 className="text-xl font-medium">Enter Keys and Text</h2>
        <div className="flex gap-3">
          <div>
            <label>Encryption/Decryption Key: </label>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              type="text"
              className="border-2"
            />
          </div>
          <div>
            <label>N: </label>
            <input
              value={n}
              onChange={(e) => setN(e.target.value)}
              type="text"
              className="border-2"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <label>Text to Encrypt/Decrypt: </label>
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="10"
            className="border-2 w-full"
          ></textarea>
        </div>
      </div>

      <div className="pt-6">
        <h2 className="text-xl font-medium">Select Operation</h2>
        <input
          type="radio"
          name="option"
          id="encrypt"
          onChange={() => setIsEncrypt(true)}
          checked={isEncrypt}
        />
        <label> Encrypt Text </label>
        <input
          type="radio"
          name="option"
          id="decrypt"
          onChange={() => setIsEncrypt(false)}
          checked={!isEncrypt}
        />
        <label> Decrypt Text </label>
      </div>

      <div className="pt-6">
        <button
          type="button"
          onClick={() => process()}
          className="p-4 border-2"
        >
          Generate Text
        </button>
        <button
          type="button"
          className="p-4 border-2"
          onClick={() => navigator.clipboard.writeText(result)}
        >
          Copy to clipboard
        </button>
      </div>

      <h1 className="pt-6 text-xl font-medium">Result:</h1>
      <div className="break-words">{result.toString(16)}</div>
    </main>
  );
}
