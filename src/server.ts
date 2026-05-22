import app from "./app";

const PORT = 3000;
const main = ()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
main();