import axios from "axios";
import { backendServerURL } from "../constants";
import { IGetMinioUrl } from "../interface/minio";
import toast from "../components/toast";

const endPoint = backendServerURL + "/uploadUrl";

export async function uploadImage(image: File) {
  return axios.get(endPoint).then(async (res) => {
    const imgUrl: IGetMinioUrl = res.data.url;

    if (!imgUrl) {
      toast("Something went wrong", "error");
      return;
    }

    await axios.put(imgUrl.url, image, {
      headers: {
        "Content-Type": image.type,
      },
    });

    return imgUrl.fileName;
  });
}
