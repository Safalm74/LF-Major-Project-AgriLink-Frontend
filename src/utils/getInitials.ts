export default function getInitials(name: string) {
  let nameParts = name.split(" ");
  let initials = nameParts[0].substring(0, 1).toUpperCase();
  if (nameParts.length > 1) {
    initials += nameParts[nameParts.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}
