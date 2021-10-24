const crypto = require('crypto');

const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA17n+XVnZJu1NBiPRkI5+xR0iVFe4O7MM8PvKmW9B5p/y0i+f
e1iCXJRL7qLj9QH6B3wEoS7jUItH6Mu7P0OZ9kfGYIM8eVjlPyoB5FKt+Dwu9GCz
zxZLZr7AolM3AyzgJcb7JTokD03+xkUZk9MinKXx86B5vqKDkWqaN96/8HtSZ+m1
HeRkqNC0TxzqhG+iU9GA1WdRZiFX+klTNmBJxhZDux8XtTNpi2pkSSizZhMyiXs0
e5m28Gs30B7TjmC3ZzrZVA2DsYcmyMsZqtOM83WYTdHNG5UTRR16nJmq8UT+oaGH
xh1bqJluJeOWeb5uaavPrgF/5uHU88ZLT7V8WwIDAQABAoIBAQCwkZqhu62iT+6Q
TPb1M7yNB7iWginYK0g3Yk/EYCz3YAl2geYuJhalQfgYfZjJa/HC+H4tk1wZC7cy
0rYTJPi6fKrhSelQhTM2DOL5h7a/DDt+aDwkDuJuWUkAU84eOjfIk+Hx6XGkWTlj
/SDfPpwAzU6JEtsy7n9zoWZSvm4pnLT8QwB7cd/3Fxb83ohQsixMxyEaosseO1dk
Jfrib0S08IYrtpQlXt2CszOxoZfYbPx3FWOPaasR9rYqWodPiAPSPUqusKQE5En3
GwRNasom4tZ98zq4JwT/6Wwu77bLqwfE9ZjkkQvN/yktyjlEP1tq2sFTHXUZj5AP
uR7MlmrZAoGBAPxfvyqO8i7wUPU8JkLzm+Xevr6k5CJleyO4iEYf+AJH5Um5GvXl
MUfUAS/MRbNT2QRDg5UshQVr6szxPz/WaeGofEe/qOWYA3PKh7J64iKhsmCiCj48
LQz4/4BtNtnQmFiEwD9JAvCvy+wvWe1YT0OMCNFc+iIyEc73JL3YTZpVAoGBANrT
dE5FOpeIWWxPY9fOBHGp1eypK6S0sDzXFnCibRMuUDsgiFISbT2kacLznCywXSO9
ebFfp48fyNRbLbQ1lCwI7pDV0nFpmYsgfJvUjzH3tf27+BTUTBrcuv210nmQuSfK
VqJUYoEVIKXj8nHZThE0BH59yAA9/7KHgRexXcvvAoGAFfwNPhrXtAkRNFu6BYkN
Ipgly5u3l9t5P6JalKlCRIiYy7RJSfReN6CbPduwkq+SLxHmi38mU1OUT6gQV3JJ
JPQ1Z1al0uJMIrEY4w5bVqL5U/uposRBNGkYcMqSxaSrMMLXsGueyvK1c+yoC8nu
lbbEKeDMlWABNyNGWxdVo0UCgYEArekB9Ta14zp8/0R1MEzOYVs95jFouyTTL/ct
IWUlVOoo32Tykm+MnEHvv/2GMEoWK9JpRdukum3jWUoBn8g5M2oB19/nuTTYz6aJ
AfvDtk2NONPLzRoQRgUJI5v+Y5juXj5D7g0soDQfV1g7FdpDXg6+R51Fd1POxJ9G
rILM7ccCgYEA6iuDv1LKOuEXL0Q6cBBA+ylWWohUiEWG9iH5dsatqjaM5kPpm5uj
9jJr/KeN+isClutFJza5sAGraW2ovWWoC2nI6NC830gnoIyrvUJ9yr3/UojRQqlg
MsCK4SMpltpNE2+slCpf5a1Bj8rSkboJ/hS0+SBjZzAecGFaYAw4vMM=
-----END RSA PRIVATE KEY-----`;

const decrypt = (password) => {
  const passwordBase64 = crypto.privateDecrypt(
    {
      key: privateKey,
    },
    Buffer.from(password, "base64")
  );
  return passwordBase64.toString();
};

module.exports = { decrypt };
