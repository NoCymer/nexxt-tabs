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
    public async fetchBackground(backgroundID: ID): Promise<any> {
        return (
            (await this.table("backgrounds").get({id: backgroundID}))["blob"]
        )
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