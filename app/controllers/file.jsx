export const handleFormSubmit = async (file, onError, onSuccess) => {

  try {

    console.log(file)
      
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name }),
    });

    const { signedUrl, path, error } = await res.json();
    if (error) {      
      return {
        message: error,
        success: false,
      }
    }

    console.log("Got signed url: ", signedUrl);

    // Step 2: Upload directly to Supabase Storage
    const uploadRes = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    console.log("Upload Result: ", uploadRes.json())

    if (!uploadRes.ok) {
      return {
        message: "Upload failed: " + (await uploadRes.text()),
        success: false,
      }
    }else if(uploadRes.ok){
      return {
        success: true,
        file: path
      }
    }

  } catch (error) {
    return {
      success: false,
      message: error
    }
  }
}