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
        return new Promise((resolve,reject) => {
            this.table("backgrounds").get({id: backgroundID}).then(background => {
                let fr = new FileReader();
    
                fr.onloadend = function(e) {
                    let fileType = "";
                    let arr = (new Uint8Array(e.target.result as ArrayBuffer)).subarray(0, 4);
                    let header = "";
                    for(let i = 0; i < arr.length; i++) {
                        header += arr[i].toString(16);
                    }
                    switch (header) {
                        case "89504e47":
                            fileType = "image/png";
                            break;
                        case "47494638":
                            fileType = "image/gif";
                            break;
                        case "ffd8ffe0":
                        case "ffd8ffe1":
                        case "ffd8ffe2":
                        case "ffd8ffe3":
                        case "ffd8ffe8":
                            fileType = "image/jpg";
                            break;
                        case "66747970":
                            fileType = "video/mp4";
                            break;
                        default:
                            fileType = background['blob']['type'];
                            break;
                    }
                    console.log(header, fileType,background["blob"].slice(0, background["blob"].size, fileType));
                    
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