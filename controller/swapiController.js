import axios from "axios";
import swapiSimple from "../model/swapiSimpleModel.js";
import enrichFunction from "../util/enrichFunction.js";
//import swapiEnrich from "../model/swapiEnrichModel.js";

const url = "https://swapi.dev/api";

const swapiController = (app) =>{
    app.get("/:entity/:id/", async (req, res) => {
        const { entity, id } = req.params;
        const enrichParams = req.query.enrichParams;
        const urlComplete = `${url}/${entity}/${id}`;

    
        if (!enrichParams) {
            const simple = new swapiSimple()
            try {
                /* const response = await axios.get(urlComplete);
                const responseData = response.data */

                const responseSimple = await simple.getResponse(urlComplete)
                res.json(responseSimple);
                
            } catch (error) {
                res.json(error)
            }
            
        } else {
            //const enrich = new swapiEnrich()
            try {
                //Maneira mais enchuta pra utilizar:
                /* const responseEnrich = await enrich.getResponse(urlComplete)
                res.json(responseEnrich) */

                const splitedParams = enrichParams.split(",");
                //console.log(splitedParams);
    
                const responseEnrichParams = await axios.get(urlComplete);
                const responseEnrichParamsData = responseEnrichParams.data
    
                
                const responseEnrichParamsObjKeys = Object.keys(responseEnrichParamsData)
                //console.log(responseEnrichParamsObjKeys);
    
                const intersection = splitedParams.filter(element=>responseEnrichParamsObjKeys.includes(element))
                //console.log(intersection);
    
                responseEnrichParamsData.enrichParams = intersection
    
                const newResponseData = responseEnrichParamsData
                await enrichFunction(splitedParams, newResponseData);
    
    
                //res.json(responseEnrichParamsData);
                res.json(newResponseData)
            } catch (error) {
                res.json(error);
            }
        }
    });
}

export default swapiController

/* async function enrichFunction(splitedParams, newResponseData) {
    for (let i = 0; i < splitedParams.length; i++) {
        if (splitedParams[i] in newResponseData) {
            const detailEntry = newResponseData[splitedParams[i]];
            //console.log(detailEntry);
            for (let j = 0; j < detailEntry.length; j++) {
                const specificEntry = detailEntry[j];
                const accessSpecificEntry = await axios.get(specificEntry);
                const accessSpecificEntryData = accessSpecificEntry.data;
                detailEntry[j] = accessSpecificEntryData;
            }
            //console.log(detailEntry) 
        }
    }
} */
