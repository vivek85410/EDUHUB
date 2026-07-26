using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System.Security.Cryptography;

namespace dotnetapp.Services
{
    public static class RsaKeyProvider
    {
        public static RSA GetPrivateKey()
        {
            var rsa = RSA.Create();

            string privateKey = File.ReadAllText("Keys/private.pem");

            rsa.ImportFromPem(privateKey);

            return rsa;
        }

        public static RSA GetPublicKey()
        {
            var rsa = RSA.Create();

            string publicKey = File.ReadAllText("Keys/public.pem");

            rsa.ImportFromPem(publicKey);

            return rsa;
        }
    }
}