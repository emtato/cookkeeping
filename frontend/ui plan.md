# Frontend navigation plan

## Overall structure

Use four bottom tabs, in this order: **Home**, **Groceries**, **Plan**, and **Recipes**. These are the four places a user is likely to return to regularly. The order keeps the shopping list easy to reach while preserving the app's core flow: find or save a recipe, plan when to eat it, and see what to buy.

Each feature should have one main home. Home previews information and links to the relevant tab; it should not become a second place to maintain the meal plan or shopping list. A recipe's full details, a collection, or a cooking view can open from a tab without becoming another permanent bottom tab.

Start with the useful core of each tab. The larger ideas below describe where future features belong, not a requirement to build all of them at once. Keep room for them in the navigation and information structure without showing empty controls or claiming that unavailable information has been calculated.

## First usable workflow — the initial connected milestone

The first useful version should prove the app's central promise with one complete path from a recipe to a shopping list. Individual screens can be built in stages, but the milestone is complete only when information moves between them without the user copying it by hand.

1. In **Recipes**, the user saves a basic recipe with a name and ingredient list, including amounts and units where relevant. Manual entry is enough for this milestone; importing and AI extraction can come later.
2. In **Plan**, the user assigns that recipe to a date and meal slot. The plan shows which recipe is scheduled and lets the user open it again.
3. In **Groceries**, the planned recipe's ingredients appear automatically with their recorded quantities. The user can check off items while shopping. A manually added item can coexist with recipe-derived items.
4. The saved recipe, plan entry, shopping items, and checked states remain available when the user moves between tabs and returns to the app. If the planned meal is removed, its generated ingredients should no longer be treated as needed; unrelated manual items should remain.
5. **Home** can provide a simple preview of the next planned meal and remaining grocery items, with links to the owning tabs. More elaborate summaries and alerts can wait until the data behind them exists.

This milestone can be tested with one recipe and one planned meal. It does not need ingredient deduplication across recipes, unit conversion, pantry deductions, nutrition calculations, external imports, or meal recommendations. Those later features should build on the same recipe → plan → groceries connection.

## 1. Home — what matters now

Home is an overview of the user's cooking plans, rather than a separate planning workspace. It should let someone open the app and quickly understand what is coming up and what needs attention.

- A short welcome area can show the current day and a useful summary, such as the next planned meal. It should be brief enough that the actionable content remains visible.
- An **Up next** card can show the next meal's name, time or meal slot, image if available, and a direct path to its recipe or plan entry.
- Small preview cards can show the next few planned meals, the current grocery list's progress or remaining items, and a path back to saved recipes. Tapping a preview opens the tab that owns the full information.
- A **Needs attention** area can surface a few timely, actionable items. Possible later examples are ingredients still needed for tomorrow's meal, food nearing its expiry date, or a planned meal that could use something already in the fridge. Each item should say what happened and where to act on it.
- If there is no plan or list yet, use a clear starting action rather than empty summaries. For example, direct the user to choose a recipe or plan a meal.

Home alerts depend on real underlying features. Missing-ingredient notices require a link between the plan and grocery list; expiry notices require pantry or leftover tracking. They can be added as those features exist. Avoid turning Home into a general notification feed where important items get buried.

## 2. Groceries — what to buy

This tab owns the shopping list and is designed to be quick to use in a store.

- Initially, show a straightforward list with item names, quantities when known, and a clear checked or unchecked state. Manual items should be possible alongside items produced from a meal plan.
- As planning and recipes become connected, planned meals can contribute ingredients to **one consolidated list**. Shared ingredients should be combined where quantities and units can be resolved reliably. The user should still be able to add, change, remove, or ignore items when reality differs from the plan.
- An item can later reveal why it is on the list: which recipe or planned meal needs it. Checking it off should not obscure that connection.
- Later improvements belong here: grouping by aisle or category, shopping mode, household list sharing, receipt-assisted checking, and accounting for ingredients already in the pantry.

The grocery list is the result of the recipe-to-plan workflow, but it remains useful as a simple list before automatic generation is ready.

## 3. Plan — what and when to cook

This tab owns the schedule of future meals. A day-by-day view should make both planned dishes and unplanned or skipped meal slots easy to understand.

- Show dates in order, with meal slots such as breakfast, lunch, and dinner. A slot can contain a recipe, be left undecided, or be marked as skipped.
- A planned dish can show its name, image if available, a short description, and its planned serving amount. A compact ingredient or preparation preview may help, but full instructions and ingredient editing belong on the recipe detail screen.
- Tapping a meal opens its plan entry or recipe, where the user can inspect it and adjust the plan. The important action is choosing a dish and when to make it, with as little repeated entry as possible.
- In the first version, planning meals can be manual. Later, changing servings can recalculate required ingredients and update the grocery list. The plan can also account for leftovers, freezer meals, and what is already in the pantry.
- The proposed **Complete my week** feature belongs here. It can eventually suggest meals based on cost, effort, nutrition, ingredient overlap, and food that needs using soon, while explaining the reason for each suggestion.

Home may show the next meal, but the Plan tab remains the place to inspect and change the schedule.

## 4. Recipes — what to make

This tab owns the recipe library and entry points for finding or adding dishes. It should work first as a place to save and revisit recipes, then expand into discovery and import.

- The main view can show saved recipes, favourites, and user-created collections. Collections might be practical groupings such as quick meals, pasta, or desserts. Search and filters can help as the library grows.
- Opening a recipe shows its image, name, description, ingredients, amounts, instructions, and servings when available. The user can edit the recipe and adjust amounts from its detail view. A clear action can add it to the meal plan.
- Discovery, search, and import should be reachable from Recipes. They do not each need their own bottom tab. Later import sources could include URLs, screenshots, food photos, and videos; extracted information should be reviewable before being treated as a usable recipe.
- Future recipe details can include cuisine, user categories, dietary attributes, nutrition and macros, substitutions, and a focused cooking view with larger steps or timers. Nutrition can also be summarized across the Plan when that data exists.
- Recommendations based on the current plan or pantry belong here, with useful explanations such as shared ingredients or how little extra needs to be bought.

## No fifth tab yet

Do not add an empty fifth tab simply to leave room for future features. Macros and nutrition fit naturally within recipe details and the meal plan; pantry information can initially live with Groceries; timely reminders belong on Home. Settings and account actions can live outside the bottom navigation. Revisit a fifth tab only if a future feature becomes a distinct place users need to open frequently.

The long-term experience should still feel like one connected flow: **choose a recipe → plan a meal → get an accurate grocery list**. The four tabs make each stage easy to find, while Home shows the current state of the whole flow.
