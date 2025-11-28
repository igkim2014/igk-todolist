const app = require("./app");
const { testConnection } = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// 🟢 [추가] 메인 경로(/) 접속 시 Swagger 문서(/api-docs)로 리다이렉트
// 주의: 만약 Swagger 주소가 '/docs' 등 다른 이름이라면 '/api-docs' 부분을 수정해주세요.
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

const startServer = async () => {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
