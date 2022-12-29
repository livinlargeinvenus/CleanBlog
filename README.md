# CleanBlog

- CleanBlog proje klasörünü oluşturalım.

```bash
mkdir CleanBlog
```

- Package.json dosyasını oluşturalım.

```bash
npm init
```

```json
"start": "nodemon app.js -L"
```

- Prettier ayarlarını yapalım.(İsteğe bağlı)

```bash
npm install prettier -D --save-exact
```

```json
{
  "tabWidth": 4,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

- Express ve Nodemon modüllerini indirelim.

```bash
npm i express --save
npm install --save-dev nodemon
```

- git init ile lokal repomuzu oluşturalım.

```bash
git init
```

- get request içerisinde const blog = { id: 1, title: "Blog title", description: "Blog description" }, içeriğini gönderelim.

```js
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    const blog = {
        id: 1,
        title: 'Blog title',
        description: 'Blog description',
    };

    res.send(blog);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda baslatildi...`);
});
```

- .gitignore dosyası oluşturalım ve ilk repomuzu gönderelim.
<https://www.toptal.com/developers/gitignore/api/node>
