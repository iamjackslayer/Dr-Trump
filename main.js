const axios = require("axios").default;
const qs = require("qs");

const vafs = "https://vafs.nus.edu.sg/adfs/oauth2/authorize?";
const htd = "https://myaces.nus.edu.sg/htd/htd";

// POST to vafs to obtain cookie
const config = {
  params: {
    response_type: "code",
    client_id: "97F0D1CACA7D41DE87538F9362924CCB-184318",
    resource: "sg_edu_nus_oauth",
    redirect_uri: "https://myaces.nus.edu.sg:443/htd/htd",
  },
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    Origin: "https://vafs.nus.edu.sg",
    Referer:
      "https://vafs.nus.edu.sg/adfs/oauth2/authorize?response_type=code&client_id=97F0D1CACA7D41DE87538F9362924CCB-184318&resource=sg_edu_nus_oauth&redirect_uri=https%3A%2F%2Fmyaces.nus.edu.sg%3A443%2Fhtd%2Fhtd",
    Host: "vafs.nus.edu.sg",
    Connection: "keep-alive",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
    // Cookie:
    //   "MSISAuth=AAEAAJd7l7ZYyntTFwa7EosA910mGvVjlwaUVLJOq2IIKuUXrHFqFagVMQtwvUA87dWIMp4fTOWWxQPqYhjZgEusWLAhP6lbOouSz6aNtohv1DoT+Vt1+iL8fkrOkaxH7goxZfqsDYKMBgy7l9MgOxAtFmCzdojt+NscZceM5gHvW2Oue0tAB+6TkDVdIfqwRwFAPep5yfMyhh7YzlMUSFU1ZQQj8wRsIvX5uGiHYkhwjTSamQPAp5kuQBb754F9FniKuMN/mzRu3LGTcqDzun1ZzraJULuzseQCwxlyIaBS4GDi5WVeF/DdHPYJcuAYgDubn50YOQj7qMKgJH+LK7zPCBO2uAj8hmNz/6ohSkiyOCnp3SyO/1ioHsV7+Cku0bapsQABAABWjYPvURTYveJ4VBfREU1zwJwg3bjSMtguPiRvy50gybrKiksVHntdmCxPnrjuvBuyyUkSUHf9B+R0ANk9k9miXj+iT1i9DFwo+NRzRgwBYEez4oLmiHSpH+KzzwGgEyA6etlGfvzun+mka9MhYj6BwQPKO/2ta3O51YwKwdWm2HMBR85lti3+0vmwaQpbwaRagE594QEEznLi32iApD3gBuUG0Dbi9pMOOMELhErObL7E718HEZQUkiV4HhyeOTD0mq/DF+jLo4eEE8xUxl9prh/1X6KRzIjdFbi+VAGuwFMQrX3fgLzkqigWqz/0i6DY6x9Je7Uprk2CFplvF2ndcAMAALbFM+IAX9ZkxRA8dHg5ujisgjg2VhqUw2ck28P/t5TOsdhYlPcudxbwldi6oicKGUGCTXjLr0EfMSwtg7SqRGWDOFKYbtxwlFyvMxVz0xhNGile2spx6fZjcaO6pITsUQ1ngtW4SkE/WN5k1zb9ZqgZCe3WV7twICx6OaDNx4HRul7kEEUrnWnTlZ2TFKYo3YBvQZTHc5PhKdZFyq8ekc/UP6gwVu47Z8T9Q2B5JmpOezASg8kDYnrrScKEG5t0sq9ydCrY5dkI4qVMjgdfr331zUYUzydwL1KavYVPGDz3k1ln3QjgBoUpfyObqENqeXrVcCUzVvRBbvs5Xo2Z9EuUMmIF8ZMDCcUyzj0FjYzBOWoVKDiKQty2Uc03P1b0Bj+2cp4FK9bu3mNorAkZb89rSdkTNEOjUH/ZNPRjC49GE3f1UuGlOl8ac9ffEkinh/9jPbZqNibhTZswe7QpTqa0QMmnl/334jQPypRNFbQ0iaZ+L644PVJ59SFTAvPZjT0aCqOMlc9vOsTwhga8lrOaJpFw0OpRZ04a7GxDFRuBbFPPLXn+P2zgeiTJUtuRtg5LJCPLprEHjpUCCvB5KirXj87IFK62z76C+8hOnaYlM1yMFCnLAsNufEMII+XzKB8OLvPhcyABxoG2ujDFg/AqybmKzvfXWihiCVDFOLs+sRMrsqTsVSQf3g4vXp8vtDLZbTbstcymMYOBghbx1TKBmoWgzj8x+bQ8XSzvu8rB2gSlwSx/YOanWDF/9K9pexmVpyA+eQttl2uUDXNyWj53QUcc55ZpGsXWg0YCWTCCGwgFkEnqJwCmiI+N+JDrZ/nXRQPuMoRGgySv2JGa3dTpCVqKofVAhJm1Lz1L9ZY90H2ix+o3hGpgT4E3IoSm7NQ+8IiRwOuYzSExIGkoztJ9JY0cd8qxOI5MMtmXeQ7ooDoFbwUNtQN6N9bbKws8dhyLaexhL09uXu2awi7410MOo6L4pa3+o1TuR66OE04mpyfSPrlpG0IuOoFIPJfZnPDv4doWyg9V8YHwPXG1HOArdBHj6J/Pw7aKjhn9+QVuIdZ5AZl8vblLDfDYiWIXbX7kcj2zIeQcINRU4GJCpDGQ/gKZiSOTpysIEFAVWQp5HdR1h33eOkE9Dx832BOq5abuVjzo27nkKQNLy/Tuc4s=; MSISAuthenticated=Ni83LzIwMjAgODoyNzo1OSBBTQ==; MSISLoopDetectionCookie=MjAyMC0wNi0wNzowODoyNzo1OVpcMQ==",
  },
  withCredentials: true,
};
const data = {
  UserName: "nusstu\\e0203257",
  Password: "Coronafocus2020",
  AuthMethod: "FormsAuthentication",
};

axios
  .post(
    vafs,
    "UserName=nusstu%5Ce0203257&Password=Coronafocus2020&AuthMethod=FormsAuthentication",
    config
  )
  .then((res) => {
    console.log(res.status);
  })
  .then((res) => {
    console.log(
      qs.stringify(data) ===
        "UserName=nusstu%5Ce0203257&Password=Coronafocus2020&AuthMethod=FormsAuthentication"
    );
  });
