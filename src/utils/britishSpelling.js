const BRITISH_SPELLING_REPLACEMENTS = [
  ["Organized", "Organised"],
  ["organized", "organised"],
  ["Organizing", "Organising"],
  ["organizing", "organising"],
  ["Organize", "Organise"],
  ["organize", "organise"],
  ["Organization", "Organisation"],
  ["organization", "organisation"],
  ["Authorized", "Authorised"],
  ["authorized", "authorised"],
  ["Authorize", "Authorise"],
  ["authorize", "authorise"],
  ["Licenses", "Licences"],
  ["licenses", "licences"],
  ["License", "Licence"],
  ["license", "licence"],
  ["Flavors", "Flavours"],
  ["flavors", "flavours"],
  ["Flavor", "Flavour"],
  ["flavor", "flavour"],
  ["Colors", "Colours"],
  ["colors", "colours"],
  ["Color", "Colour"],
  ["color", "colour"],
  ["Molds", "Moulds"],
  ["molds", "moulds"],
  ["Mold", "Mould"],
  ["mold", "mould"],
  ["Fibers", "Fibres"],
  ["fibers", "fibres"],
  ["Fiber", "Fibre"],
  ["fiber", "fibre"],
  ["Sulfur", "Sulphur"],
  ["sulfur", "sulphur"],
  ["Aluminum", "Aluminium"],
  ["aluminum", "aluminium"],
  ["Gray", "Grey"],
  ["gray", "grey"],
  ["Behavior", "Behaviour"],
  ["behavior", "behaviour"],
  ["Favorite", "Favourite"],
  ["favorite", "favourite"],
  ["Customize", "Customise"],
  ["customize", "customise"],
  ["Customized", "Customised"],
  ["customized", "customised"],
  ["Recognize", "Recognise"],
  ["recognize", "recognise"],
  ["Recognized", "Recognised"],
  ["recognized", "recognised"],
  ["Analyze", "Analyse"],
  ["analyze", "analyse"],
  ["Analyzed", "Analysed"],
  ["analyzed", "analysed"],
  ["Odor", "Odour"],
  ["odor", "odour"],
  ["Labeling", "Labelling"],
  ["labeling", "labelling"],
  ["Labeled", "Labelled"],
  ["labeled", "labelled"],
];

/**
 * Converts common American spellings to British English for display copy.
 */
export const toBritishSpelling = (text) => {
  if (text == null || typeof text !== "string" || text.length === 0) {
    return text;
  }

  let result = text;

  for (const [american, british] of BRITISH_SPELLING_REPLACEMENTS) {
    result = result.replaceAll(american, british);
  }

  return result;
};
