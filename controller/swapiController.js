import axios from "axios";
import swapiSimple from "../model/swapiSimpleModel.js";

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
            
            try {
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
                for (let i = 0; i<splitedParams.length; i++){
                    if(splitedParams[i] in newResponseData){
                        const detailEntry = newResponseData[splitedParams[i]]
                        //console.log(detailEntry);
                        for(let j = 0; j< detailEntry.length; j++){
                            const specificEntry = detailEntry[j]
                            const accessSpecificEntry = await axios.get(specificEntry)
                            const accessSpecificEntryData = accessSpecificEntry.data
                            detailEntry[j] = accessSpecificEntryData
                        }
                        //console.log(detailEntry) 
                    } 
                }
    
    
                //res.json(responseEnrichParamsData);
                res.json(newResponseData)
            } catch (error) {
                res.json(error);
            }
        }
    });
}

export default swapiController