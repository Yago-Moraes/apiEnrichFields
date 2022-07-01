import express from "express";
import axios from "axios";

const app = express();
const port = 8080;
const url = "https://swapi.dev/api";

app.use(express.json());

app.get("/:entity/:id/", async (req, res) => {
    const { entity, id } = req.params;
    const enrichParams = req.query.enrichParams;

    if (!enrichParams) {
        console.log("Sem parametros");
    } else {
        const urlComplete = `${url}/${entity}/${id}`;
        try {
            const splitedParams = enrichParams.split(",");
            console.log(splitedParams);

            const response = await axios.get(urlComplete);
            res.send(response.data);
            const responseObjKeys = Object.keys(response.data)
            console.log(responseObjKeys);

            const intersection = splitedParams.filter(element=>responseObjKeys.includes(element))
            console.log(intersection);
        } catch (error) {
            res.send(error);
        }
    }
});

app.listen(port, () => {
    console.log(`Servidor aberto no http://localhost:${port}`);
});

// site/parametro/id/?enrichParams=...
