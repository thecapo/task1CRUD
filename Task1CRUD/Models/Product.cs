using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Task1CRUD.Models
{
    public partial class Product
    {
        public Product()
        {
            Sales = new HashSet<Sales>();
        }

        public int Id { get; set; }

        [StringLength(50, MinimumLength = 2)]
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(1, 9999, ErrorMessage = "Salary must be between 1 and 9999")]
        public int Price { get; set; }

        public virtual ICollection<Sales> Sales { get; set; }
    }
}
