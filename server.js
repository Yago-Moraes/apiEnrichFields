import express from "express";
import axios from "axios";

const app = express();
const port = 8080;
const url = "https://swapi.dev/api";

app.use(express.json());

app.get("/:entity/:id/", async (req, res) => {
    const { entity, id } = req.params;
    const enrichParams = req.query.enrichParams;
    const urlComplete = `${url}/${entity}/${id}`;

    if (!enrichParams) {
        try {
            const response = await axios.get(urlComplete);
            const responseData = response.data
            res.send(responseData);
            
        } catch (error) {
            res.send(error)
        }
        
    } else {
        
        try {
            const splitedParams = enrichParams.split(",");
            /* console.log(splitedParams); */

            const responseEnrichParams = await axios.get(urlComplete);
            const responseEnrichParamsData = responseEnrichParams.data

            
            const responseEnrichParamsObjKeys = Object.keys(responseEnrichParamsData)
            /* console.log(responseEnrichParamsObjKeys); */

            const intersection = splitedParams.filter(element=>responseEnrichParamsObjKeys.includes(element))
            /* console.log(intersection); */

            responseEnrichParamsData.enrichParams = intersection

        
            for (let i = 0; i<splitedParams.length; i++){
                if(splitedParams[i] in responseEnrichParamsData){
                    const detailEntry = responseEnrichParamsData[splitedParams[i]]
                    console.log(detailEntry);
                    for(let i = 0; i< detailEntry.length; i++){
                        const specificEntry = detailEntry[i]
                        const accessSpecificEntry = await axios.get(specificEntry)
                        const accessSpecificEntryData = accessSpecificEntry.data
                        detailEntry[i] = accessSpecificEntryData
                    }
                    console.log(detailEntry) 
                } 
            }


            res.send(responseEnrichParamsData);
        } catch (error) {
            res.send(error);
        }
    }
});

app.listen(port, () => {
    console.log(`Servidor aberto no http://localhost:${port}`);
});
