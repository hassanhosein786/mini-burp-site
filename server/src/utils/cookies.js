export const parseSetCookieHeaders = (setCookieHeader) => {
  const lines = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : setCookieHeader
      ? [setCookieHeader]
      : [];

  return lines.map((line) => {
    const parts = line.split(";").map((part) => part.trim());
    const [nameValue = "unknown=", ...attrs] = parts;
    const [name = "unknown"] = nameValue.split("=");
    const sameSite = attrs.find((attr) => attr.toLowerCase().startsWith("samesite="));

    return {
      name,
      httpOnly: attrs.some((attr) => attr.toLowerCase() === "httponly"),
      secure: attrs.some((attr) => attr.toLowerCase() === "secure"),
      sameSite: sameSite ? sameSite.split("=")[1] : "",
      raw: line
    };
  });
};

