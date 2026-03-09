

INSERT INTO public.account
VALUES (1, 'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')

DELETE FROM public.account
WHERE account_id = 1

UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1


UPDATE public.inventory
SET inv_description = 'a huge interior'
WHERE inv_model = 'Hummer'



SELECT inv_make, inv_model, classification_name FROM public.inventory
JOIN public.classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport'

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images', 'images/vehicles')
SET inv_thumbnail = REPLACE(inv_thumbnail, 'images', 'images/vehicles')




