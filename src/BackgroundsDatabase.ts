import Dexie from "dexie";
type ID = string;

/** Database that contains all backgrounds */
class BackgroundsDatabase extends Dexie {
    constructor () {
        super("Backgrounds");
        this.version(3).stores({
            backgrounds: '&id'
        });
    }

    /**
     * Fetches all IDs stored in the database
     * @returns Array of IDs contained in the database
     */
    public async fetchIds() {
        return (await this.table("backgrounds").toArray()).map((background) => {
            return background["id"];
        })
    }

    /**
     * Stores a background in the database
     * @param backgroundID Id of the background
     * @param backgroundBlob BLOB representing the background
     */
    public async storeBackground(backgroundID: ID, backgroundBlob: any) {
        await this.table("backgrounds").put(
            {id: backgroundID, blob: backgroundBlob}
        );
    }
    /**
     * Returns a blob of a background stored in the database
     * that has a given id
     * @param backgroundID Id of the background
     * @returns BLOB Corresponding to the background
     */
    public fetchBackground(backgroundID: ID): Promise<any> {
        const headersTypes = {
            "image/png" : ["89504e47"],
            "image/gif" : ["47494638"],
            "image/jpg" : ["ffd8ffe0","ffd8ffe1","ffd8ffe2","ffd8ffe3","ffd8ffe8"],
            "video/mp4" : ["66747970"]
        }
        return new Promise((resolve,reject) => {
            this.table("backgrounds").get({id: backgroundID}).then(background => {
                let fr = new FileReader();
    
                fr.onloadend = function(e) {
                    // Extracts the first bytes of the blob
                    let arr = (new Uint8Array(e.target.result as ArrayBuffer)).subarray(0, 8);
                    let fileHeader = "";
                    for(let i = 0; i < arr.length; i++) {
                        fileHeader += arr[i].toString(16);
                    }

                    // Compares the extracted bytes to predefined headers
                    let fileType = "";
                    Object.keys(headersTypes).forEach(headerType => {
                        headersTypes[headerType].forEach(header => {
                            if(fileHeader.includes(header)) fileType = headerType;
                        }) 
                    });

                    // Fallback value
                    if(fileType.length == 0) fileType = background['blob']['type'];
                    
                    resolve(background["blob"].slice(0, background["blob"].size, fileType));
                };
                fr.readAsArrayBuffer(background['blob']);
            });
        })
        
    }

    /**
     * Deletes a background in the database that has a given id
     * @param backgroundID ID of the background to delete
     */
    public async deleteBackground(backgroundID: ID) {
        await this.table("backgrounds").delete(backgroundID);
    }
}

const backgroundsDB = new BackgroundsDatabase();

export default backgroundsDB;