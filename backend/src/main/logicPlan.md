# title
## subtitle

hello 

## grocery list logic:
items are added instantly when meal is planned for the coming 7 days 

items are removed from list when the day they are used passes (-> there would be no need to have it on the list anymore even if the user didnt buy it )


items are NOT removed when they are checked off
items may be sent to a little "bought" section at the bottom a day after they are checked off to emphasize unbought items while keeping future meals' ingredients still visible (TODO).

items shouldnt disappear when checked off to prevent accidental click -> removal of items. when items checked, button appears at bottom to instantly trigger the send-to-bottom behaviour (TODO)

## api routes: /api/ 
+ general context: recipe/ or groceries/
+ action: add, remove, etc
