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
                const responseSimple = await simple.getResponse(urlComplete)
                res.json(responseSimple);
            } catch (error) {
                res.json(error)
            }
            
        } else {
            try {
                const splitedParams = enrichParams.split(",");
    
                const responseEnrichParams = await axios.get(urlComplete);
                const responseEnrichParamsData = responseEnrichParams.data
          
                const responseEnrichParamsObjKeys = Object.keys(responseEnrichParamsData)
    
                const intersection = splitedParams.filter(element=>responseEnrichParamsObjKeys.includes(element))
    
                responseEnrichParamsData.enrichParams = intersection
    
                const newResponseData = responseEnrichParamsData
                await enrichFunction(splitedParams, newResponseData);
    
                res.json(newResponseData)

            } catch (error) {
                res.json(error);
            }
        }
    });
}

export default swapiController
