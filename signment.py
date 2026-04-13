
import math

def quad(a,b, c):
    pos = (-(b) + math.sqrt(pow((b), 2) - 4 * a *c)) / 2 * a
    neg = (-(b) - math.sqrt(pow((b), 2) - 4 * a *c)) / 2 * a
    result = print(f"x = {pos}, x = {neg}");
    return result

quad(1, -3, -4)
    