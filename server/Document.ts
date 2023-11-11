import { Schema, model, Document } from "mongoose";

interface Doc extends Document {
  data: object;
}

const DocumentSchema = new Schema<Doc>({
  _id: String,
  data: Object,
});

export default model<Doc>("Document", DocumentSchema);
